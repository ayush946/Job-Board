const express = require("express");
const ApplicantSkill = require("../models/ApplicantSkill");
const JobSkill = require("../models/JobSkill");

const router = express.Router();

// Add a skill to an applicant
router.post("/add/applicant/:applicantId", async (req, res) => {
    const { skill_ids } = req.body;

    if (!Array.isArray(skill_ids) || skill_ids.length === 0) {
      return res.status(400).json({ message: "skill_ids must be a non-empty array" });
    }
  
    try {
      const applicantSkills = await Promise.all(
        skill_ids.map(skill_id => 
          new ApplicantSkill({
            applicantId: req.params.applicantId,
            skillId: skill_id
          }).save()
        )
      );
      res.status(201).json(applicantSkills);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
});

// Get all skills for a specific applicant
router.get("/view/applicant/:applicantId", async (req, res) => {
  try {
    const applicantSkills = await ApplicantSkill.find({ applicant_id: req.params.applicantId }).populate('skill_id');
    res.status(200).json(applicantSkills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Remove a skill from an applicant
router.delete("/delete/applicant/:id", async (req, res) => {
  try {
    const applicantSkill = await ApplicantSkill.findByIdAndDelete(req.params.id);
    if (!applicantSkill) {
      return res.status(404).json({ message: "Applicant skill not found" });
    }
    res.status(200).json({ message: "Applicant skill deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Add multiple skills to a job
router.post("/add/job/:jobId", async (req, res) => {
  const { skill_ids } = req.body;

  if (!Array.isArray(skill_ids) || skill_ids.length === 0) {
    return res.status(400).json({ message: "skill_ids must be a non-empty array" });
  }

  try {
    const jobSkills = await Promise.all(
      skill_ids.map(skill_id => 
        new JobSkill({
          jobId: req.params.jobId,
          skillId: skill_id
        }).save()
      )
    );
    res.status(201).json(jobSkills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all skills for a specific job
router.get("/view/job/:jobId", async (req, res) => {
try {
  const jobSkills = await JobSkill.find({ job_id: req.params.jobId }).populate('skill_id');
  res.status(200).json(jobSkills);
} catch (error) {
  res.status(500).json({ message: error.message });
}
});

// Remove a skill from a job
router.delete("/delete/job/:id", async (req, res) => {
try {
  const jobSkill = await JobSkill.findByIdAndDelete(req.params.id);
  if (!jobSkill) {
    return res.status(404).json({ message: "Job skill not found" });
  }
  res.status(200).json({ message: "Job skill deleted" });
} catch (error) {
  res.status(500).json({ message: error.message });
}
});

module.exports = router;
