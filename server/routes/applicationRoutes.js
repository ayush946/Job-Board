const express = require("express");
const mongoose = require("mongoose");
const JobApplication = require("../models/JobApplication");

const router = express.Router();

// Create an JobApplication
router.post("/create", async (req, res) => {
  try {
    const { applicantId, jobId, resume } = req.body;
    const newApplication = new JobApplication({
      applicantId,
      jobId,
      resume,
    });
    const savedApplication = await newApplication.save();
    res.status(201).json(savedApplication);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get All Applications of a particular applicant (My jobs section)
router.get("/applicant/:applicantId", async (req, res) => {
    try {
      const { applicantId } = req.params;
      const applications = await JobApplication.find({ applicantId }).populate('applicantId jobId');
      if (applications.length === 0) {
        return res.status(404).json({ message: "No applications found for this applicant" });
      }
      res.status(200).json(applications);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
});

// View JobApplication by ID
router.get("/view/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const application = await JobApplication.findById(id).populate('applicantId jobId');
    if (!application) {
      return res.status(404).json({ message: "JobApplication not found" });
    }
    res.status(200).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete JobApplication by ID
router.patch("/applications/:id/delete", async (req, res) => {
    try {
      const { id } = req.params;
      const application = await JobApplication.findById(id);
      
      if (!application) {
        return res.status(404).json({ message: "JobApplication not found" });
      }
      
      application.status = "Deleted";
      await application.save();
      
      res.status(200).json({ message: "JobApplication status changed to deleted", application });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
});

module.exports = router;
