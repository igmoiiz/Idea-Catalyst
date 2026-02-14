const express = require("express");
const router = express.Router();
const multer = require("multer");
const jwt = require("jsonwebtoken");
const facultyController = require("../controllers/faculty.controller");

// Multer setup for memory storage
const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // xlsx
    "application/vnd.ms-excel", // xls
    "text/csv", // csv
    "application/csv", // csv
    "text/plain" // csv sometimes
  ];

  // Check extension as well because mime types can be unreliable
  const allowedExtensions = ['.xlsx', '.xls', '.csv'];
  const fileExt = file.originalname.toLowerCase().slice(file.originalname.lastIndexOf('.'));

  if (allowedTypes.includes(file.mimetype) || allowedExtensions.includes(fileExt)) {
    cb(null, true);
  } else {
    cb(new Error("Only .xlsx, .xls, and .csv formats are allowed!"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter
});

// Middleware for token authentication (Header-based)
const requireFacultyAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "faculty") {
      return res.status(403).json({ success: false, message: "Access denied. Faculty only." });
    }
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

// Public Routes
router.post("/login", facultyController.login);
router.get("/projects", facultyController.getProjects);

// Protected Routes
router.post("/upload", requireFacultyAuth, (req, res, next) => {
  upload.single("file")(req, res, (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    next();
  });
}, facultyController.uploadFile);
router.post("/logout", facultyController.logout);

module.exports = router;
