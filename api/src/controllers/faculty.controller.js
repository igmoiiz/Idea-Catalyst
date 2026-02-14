const path = require("path");
const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { createClient } = require("@supabase/supabase-js");

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

    // Get public URL
    const { data: publicUrlData } = supabase
        .storage
        .from(process.env.SUPABASE_BUCKET_NAME || 'project-data')
        .getPublicUrl(fileName);

    res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      data: {
          path: data.path,
          fullPath: data.fullPath,
          publicUrl: publicUrlData.publicUrl,
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

const xlsx = require("xlsx");

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
        const { department } = req.query;

        console.log(`Fetching projects for department: ${department}`);

        if (!department) {
            return res.status(400).json({
                success: false,
                message: "Department is required"
            });
        }

        // Check if Supabase is configured
        if (!supabase) {
            return res.status(500).json({
                success: false,
                message: "Supabase is not configured on the server."
            });
        }

        // List files in department folder
        const folder = department; 
        const { data: files, error: listError } = await supabase
            .storage
            .from(process.env.SUPABASE_BUCKET_NAME || 'project-data')
            .list(folder, {
                limit: 10,
                offset: 0,
                sortBy: { column: 'created_at', order: 'desc' },
            });

        if (listError) {
             console.error("Supabase list error:", listError);
             return res.status(500).json({
                 success: false,
                 message: `Failed to list files: ${listError.message}`
             });
        }

        if (!files || files.length === 0) {
            console.log("No files found for department:", department);
            return res.status(200).json({
                success: true,
                data: []
            });
        }

        // Get the latest file (should be first due to sort)
        const latestFile = files[0];
        const filePath = `${folder}/${latestFile.name}`;
        console.log(`Processing latest file: ${filePath}`);

        // Download the file
        const { data: fileData, error: downloadError } = await supabase
            .storage
            .from(process.env.SUPABASE_BUCKET_NAME || 'project-data')
            .download(filePath);

        if (downloadError) {
            console.error("Supabase download error:", downloadError);
            return res.status(500).json({
                success: false,
                message: `Failed to download file: ${downloadError.message}`
            });
        }

        // Parse Excel file
        const buffer = await fileData.arrayBuffer();
        const workbook = xlsx.read(buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        
        // Smart Header Detection
        // 1. Get raw data as array of arrays
        const rawRows = xlsx.utils.sheet_to_json(sheet, { header: 1 });
        
        let headerRowIndex = 0;
        let maxMatches = 0;
        
        if (rawRows.length > 0) {
            // Scan first 10 rows to find the most likely header row
            for (let i = 0; i < Math.min(rawRows.length, 10); i++) {
                const row = rawRows[i];
                if (!row || !Array.isArray(row)) continue;
                
                let matches = 0;
                const rowString = row.join(' ').toLowerCase();
                
                if (rowString.includes('supervisor') || rowString.includes('name') || rowString.includes('faculty')) matches++;
                if (rowString.includes('area') || rowString.includes('search') || rowString.includes('domain')) matches++;
                if (rowString.includes('idea') || rowString.includes('project') || rowString.includes('title')) matches++;
                
                if (matches > maxMatches) {
                    maxMatches = matches;
                    headerRowIndex = i;
                }
                
                // If we found a row with all 3 key concepts, stop searching
                if (matches >= 3) break;
            }
        }
        
        console.log(`Smart Header Detection: Using row ${headerRowIndex} as header (matches: ${maxMatches})`);
        
        // 2. Parse data starting from the detected header row
        const jsonData = xlsx.utils.sheet_to_json(sheet, { range: headerRowIndex });

        if (jsonData.length === 0) {
            return res.status(200).json({ success: true, data: [] });
        }

        // Inspect header keys from the first row of parsed data
        // sheet_to_json with range automatically uses that row as keys
        const firstRow = jsonData[0];
        const keys = Object.keys(firstRow);
        console.log("Excel Headers Found:", keys);

        // Helper to find matching key case-insensitive
        const findKey = (keywords) => {
            return keys.find(key => 
                keywords.some(keyword => key.toLowerCase().includes(keyword.toLowerCase()))
            );
        };

        const supervisorKey = findKey(['supervisor', 'name', 'faculty', 'teacher']) || keys.find(k => k.toLowerCase().includes('sup')) || 'supervisor';
        const areaKey = findKey(['area', 'domain', 'field', 'interest', 'research']) || 'interested_area';
        
        // Find ALL keys that look like project ideas
        const ideaKeys = keys.filter(key => {
            const lowerKey = key.toLowerCase();
            return (lowerKey.includes('idea') || lowerKey.includes('project') || lowerKey.includes('title')) &&
                   !lowerKey.includes('area') && 
                   !lowerKey.includes('domain') && 
                   !lowerKey.includes('supervisor');
        });

        // If no specific idea keys found, fallback to default
        if (ideaKeys.length === 0) {
            ideaKeys.push('project_idea');
        }

        console.log(`Mapped Keys - Supervisor: ${supervisorKey}, Area: ${areaKey}, Idea Keys: ${ideaKeys.join(', ')}`);

        // Map to expected format, flattening multiple ideas per row
        const projects = [];
        
        jsonData.forEach((row, rowIndex) => {
            const supervisor = row[supervisorKey] || "Unknown Faculty";
            const area = row[areaKey] || "General Area";

            // Iterate through all identified idea columns
            ideaKeys.forEach((ideaKey, ideaIndex) => {
                const idea = row[ideaKey];
                if (idea && typeof idea === 'string' && idea.trim().length > 0) {
                    projects.push({
                        id: `${department}-${rowIndex}-${ideaIndex}`,
                        supervisor: supervisor,
                        interested_area: area,
                        project_idea: idea.trim(),
                        department: department
                    });
                }
            });
        });

        res.status(200).json({
            success: true,
            data: projects
        });

    } catch (error) {
        console.error("Get projects error:", error);
        res.status(500).json({
            success: false,
            message: "Server error while fetching projects",
            error: error.message
        });
    }
};
