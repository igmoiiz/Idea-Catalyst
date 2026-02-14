const express = require("express");
const router = express.Router();
const multer = require("multer");
const jwt = require("jsonwebtoken");
const facultyController = require("../controllers/faculty.controller");

// Multer setup for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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
router.post("/upload", requireFacultyAuth, upload.single("file"), facultyController.uploadFile);
router.post("/logout", facultyController.logout);

module.exports = router;
