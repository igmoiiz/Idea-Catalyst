const mongoose = require("mongoose");

const facultyProjectSchema = new mongoose.Schema(
  {
    supervisor: {
      type: String,
      required: true,
      trim: true,
    },
    department: {
      type: String,
      required: true,
      trim: true,
    },
    interested_area: {
      type: String,
      required: true,
      trim: true,
    },
    project_idea: {
      type: String,
      required: true,
      trim: true,
    },
    details: {
      type: String,
      default: "",
    },
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    sourceFilePath: {
      type: String,
      default: "",
    },
    rowIndex: {
      type: Number,
      default: null,
    },
    uploadBatch: {
      type: String,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient queries: department + uploadBatch, and department + supervisor
facultyProjectSchema.index({ department: 1, uploadBatch: -1 });
facultyProjectSchema.index({ department: 1, supervisor: 1 });

const FacultyProject = mongoose.model("FacultyProject", facultyProjectSchema);

module.exports = FacultyProject;
