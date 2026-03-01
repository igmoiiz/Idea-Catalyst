const path = require("path");
const mongoose = require("mongoose");
const User = require("../models/user.model");
const FacultyProject = require("../models/facultyProject.model");
const geminiService = require("../services/gemini.service");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { createClient } = require("@supabase/supabase-js");
const xlsx = require("xlsx");

// Initializing Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

// Controller for processing login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide email and password"
            });
        }

        const user = await User.findOne({ email }).select("+password");

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        if (user.role !== "faculty") {
            return res.status(403).json({
                success: false,
                message: "Access denied. Faculty only."
            });
        }

        // Generate token
        const token = jwt.sign(
            { id: user._id, role: user.role, department: user.department },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                department: user.department,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// Controller for handling file upload
exports.uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded."
            });
        }

        // Check if Supabase is configured
        if (!supabase) {
            return res.status(500).json({
                success: false,
                message: "Supabase is not configured on the server."
            });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const file = req.file;
        // Use user's department for folder organization
        const department = user.department || 'General';
        const timestamp = Date.now();
        const fileExt = path.extname(file.originalname);
        // Sanitize filename
        const sanitizedOriginalName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
        const fileName = `${department}/${timestamp}_${sanitizedOriginalName}`;

        const { data, error } = await supabase
            .storage
            .from(process.env.SUPABASE_BUCKET_NAME || 'project-data')
            .upload(fileName, file.buffer, {
                contentType: file.mimetype,
                upsert: false
            });

        if (error) {
            console.error("Supabase upload error:", error);
            return res.status(500).json({
                success: false,
                message: `Upload failed: ${error.message}`
            });
        }

        // Parse file and persist enriched projects to MongoDB
        let projectCount = 0;
        try {
            const parsed = parseProjectsFromBuffer(file.buffer, department);
            if (parsed.length === 0) {
                return res.status(200).json({
                    success: true,
                    message: "File uploaded successfully. No valid project rows found.",
                    count: 0,
                    data: {
                        path: data.path,
                        fullPath: data.fullPath,
                        department: department,
                        fileName: fileName
                    }
                });
            }

            const uploadBatch = new mongoose.Types.ObjectId().toString();

            // Generate Gemini details for each project (batch of 5 to limit concurrency)
            const BATCH_SIZE = 5;
            const projectDocs = [];

            for (let i = 0; i < parsed.length; i += BATCH_SIZE) {
                const batch = parsed.slice(i, i + BATCH_SIZE);
                const detailsResults = await Promise.all(
                    batch.map((p) => geminiService.generateProjectDetails(p))
                );

                for (let j = 0; j < batch.length; j++) {
                    const p = batch[j];
                    const { details } = detailsResults[j];
                    projectDocs.push({
                        supervisor: p.supervisor,
                        department: p.department,
                        interested_area: p.interested_area,
                        project_idea: p.project_idea,
                        details: details || "",
                        faculty: user._id,
                        sourceFilePath: fileName,
                        rowIndex: p.rowIndex,
                        uploadBatch,
                    });
                }
            }

            // Remove previous projects for this department (keep only latest upload)
            await FacultyProject.deleteMany({ department });

            await FacultyProject.insertMany(projectDocs);
            projectCount = projectDocs.length;
            console.log(`✓ Persisted ${projectCount} faculty projects for department ${department}`);
        } catch (parseError) {
            console.error("Parse/enrich error:", parseError);
            // Still return success for Supabase upload; projects just won't be in Mongo
            return res.status(200).json({
                success: true,
                message: "File uploaded to storage, but project processing failed. " + parseError.message,
                count: 0,
                data: {
                    path: data.path,
                    fullPath: data.fullPath,
                    department: department,
                    fileName: fileName
                }
            });
        }

        res.status(200).json({
            success: true,
            message: "File uploaded successfully",
            count: projectCount,
            data: {
                path: data.path,
                fullPath: data.fullPath,
                department: department,
                fileName: fileName
            }
        });

    } catch (error) {
        console.error("Upload handler error:", error);
        res.status(500).json({
            success: false,
            message: "Server error during upload."
        });
    }
};

/**
 * Parse spreadsheet buffer into project objects.
 * Shared by upload (for Mongo persistence) and getProjects fallback (Supabase-only).
 * @param {Buffer} buffer - File buffer from multer or Supabase download
 * @param {string} department - Department code
 * @returns {Array<{ supervisor: string, interested_area: string, project_idea: string, department: string, rowIndex: number }>}
 */
function parseProjectsFromBuffer(buffer, department) {
    let workbook;
    try {
        workbook = xlsx.read(buffer, { type: "buffer" });
    } catch (e) {
        throw new Error("Failed to parse file. Ensure it is a valid Excel (.xlsx, .xls) or CSV (.csv) file.");
    }

    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rawRows = xlsx.utils.sheet_to_json(sheet, { header: 1 });

    let headerRowIndex = 0;
    let maxMatches = 0;

    if (rawRows.length > 0) {
        for (let i = 0; i < Math.min(rawRows.length, 10); i++) {
            const row = rawRows[i];
            if (!row || !Array.isArray(row)) continue;

            let matches = 0;
            const rowString = row.join(" ").toLowerCase();
            if (rowString.includes("supervisor") || rowString.includes("name") || rowString.includes("faculty")) matches++;
            if (rowString.includes("area") || rowString.includes("search") || rowString.includes("domain")) matches++;
            if (rowString.includes("idea") || rowString.includes("project") || rowString.includes("title")) matches++;

            if (matches > maxMatches) {
                maxMatches = matches;
                headerRowIndex = i;
            }
            if (matches >= 3) break;
        }
    }

    const jsonData = xlsx.utils.sheet_to_json(sheet, { range: headerRowIndex });
    if (jsonData.length === 0) return [];

    const firstRow = jsonData[0];
    const keys = Object.keys(firstRow);

    const findKey = (keywords) =>
        keys.find((key) =>
            keywords.some((kw) => key.toLowerCase().includes(kw.toLowerCase()))
        );

    const supervisorKey = findKey(["supervisor", "name", "faculty", "teacher"]) || keys.find((k) => k.toLowerCase().includes("sup")) || "supervisor";
    const areaKey = findKey(["area", "domain", "field", "interest", "research"]) || "interested_area";

    let ideaKeys = keys.filter((key) => {
        const lowerKey = key.toLowerCase();
        return (lowerKey.includes("idea") || lowerKey.includes("project") || lowerKey.includes("title")) &&
            !lowerKey.includes("area") && !lowerKey.includes("domain") && !lowerKey.includes("supervisor");
    });
    if (ideaKeys.length === 0) ideaKeys = ["project_idea"];

    const projects = [];
    jsonData.forEach((row, rowIndex) => {
        const supervisor = row[supervisorKey] || "Unknown Faculty";
        const area = row[areaKey] || "General Area";

        ideaKeys.forEach((ideaKey, ideaIndex) => {
            const idea = row[ideaKey];
            if (idea && typeof idea === "string" && idea.trim().length > 0) {
                projects.push({
                    supervisor,
                    interested_area: area,
                    project_idea: idea.trim(),
                    department,
                    rowIndex,
                });
            }
        });
    });

    return projects;
}

exports.logout = (req, res) => {
    // Client-side can just discard the token, but we return success here
    res.status(200).json({
        success: true,
        message: "Logged out successfully"
    });
};

// Controller for fetching projects
exports.getProjects = async (req, res) => {
    try {
        const { department, supervisor } = req.query;

        console.log(`Fetching projects for department: ${department}${supervisor ? `, supervisor: ${supervisor}` : ""}`);

        if (!department) {
            return res.status(400).json({
                success: false,
                message: "Department is required"
            });
        }

        // 1. Try MongoDB first (FacultyProject)
        const mongoFilter = { department };
        if (supervisor && String(supervisor).trim()) {
            mongoFilter.supervisor = new RegExp(`^${String(supervisor).trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i");
        }

        const mongoProjects = await FacultyProject.find(mongoFilter).sort({ createdAt: 1 }).lean();

        if (mongoProjects.length > 0) {
            const data = mongoProjects.map((p) => ({
                id: p._id.toString(),
                supervisor: p.supervisor,
                interested_area: p.interested_area,
                project_idea: p.project_idea,
                department: p.department,
                details: p.details || undefined,
            }));
            return res.status(200).json({ success: true, data });
        }

        // 2. Fallback: Supabase + parse (for deployments with only legacy uploads)
        if (!supabase) {
            return res.status(200).json({ success: true, data: [] });
        }

        const folder = department;
        const { data: files, error: listError } = await supabase
            .storage
            .from(process.env.SUPABASE_BUCKET_NAME || "project-data")
            .list(folder, {
                limit: 10,
                offset: 0,
                sortBy: { column: "created_at", order: "desc" },
            });

        if (listError || !files || files.length === 0) {
            return res.status(200).json({ success: true, data: [] });
        }

        const latestFile = files[0];
        const filePath = `${folder}/${latestFile.name}`;
        const { data: fileData, error: downloadError } = await supabase
            .storage
            .from(process.env.SUPABASE_BUCKET_NAME || "project-data")
            .download(filePath);

        if (downloadError) {
            return res.status(200).json({ success: true, data: [] });
        }

        const buffer = Buffer.from(await fileData.arrayBuffer());
        let parsed;
        try {
            parsed = parseProjectsFromBuffer(buffer, department);
        } catch (e) {
            return res.status(200).json({ success: true, data: [] });
        }

        // Filter by supervisor if provided
        let filtered = parsed;
        if (supervisor && String(supervisor).trim()) {
            const supLower = String(supervisor).trim().toLowerCase();
            filtered = parsed.filter((p) => p.supervisor.toLowerCase() === supLower);
        }

        const data = filtered.map((p, idx) => ({
            id: `${department}-fallback-${idx}`,
            supervisor: p.supervisor,
            interested_area: p.interested_area,
            project_idea: p.project_idea,
            department: p.department,
            details: undefined,
        }));

        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error("Get projects error:", error);
        res.status(500).json({
            success: false,
            message: "Server error while fetching projects",
            error: error.message
        });
    }
};
