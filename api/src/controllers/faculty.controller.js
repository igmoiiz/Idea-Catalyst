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

exports.logout = (req, res) => {
    // Client-side can just discard the token, but we return success here
    res.status(200).json({ 
        success: true, 
        message: "Logged out successfully" 
    });
};
