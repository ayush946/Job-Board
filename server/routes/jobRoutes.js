const express = require("express");
const jwtAuth = require("../lib/jwtAuth");

const Job = require("../models/Job");
const Skill = require("../models/Skill");
const sendJobApplicationConfirmation = require('../lib/email');

const router = express.Router();

// Create a job
router.post("/jobs/new", jwtAuth, async (req, res) => {
    const user = req.user;
    if (user.role !== "recruiter") {
        return res.status(401).json({
            message: "Permission denied"
        });
    }

    const data = req.body;

    // Checking if the entered skill is already present, if not then adding that skill
    if (data.skills && data.skills.length > 0) {
        try {
            for (let skillName of data.skills) {
                let skill = await Skill.findOne({ name: skillName });
                if (!skill) {
                    skill = new Skill({ name: skillName });
                    await skill.save();
                }
            }
        } catch (err) {
            return res.status(500).json({
                message: "Error adding skills",
                error: err.message,
            });
        }
    }

    const job = new Job({
        recruiterId: user._id,
        title: data.title,
        maxOpenPositions: data.maxOpenPositions,
        dateOfPosting: data.dateOfPosting,
        jobType: data.jobType,
        location: data.location,
        salary: data.salary,
        yearOfExperienceReq: data.yearOfExperienceReq,
        skills: data.skills
    });

    job.save()
        .then(() => {
           
            res.json({ message: "Job added successfully" });
        })
        .catch((err) => {
            res.status(400).json(err);
        });
});

// Get all jobs posted by the recruiter
router.get("/jobs/all", jwtAuth, (req, res) => {
    const user = req.user;

    if (user.role !== "recruiter") {
        return res.status(401).json({
            message: "Permission denied"
        });
    }

    Job.find({ recruiterId: user._id })
        .then((jobs) => {
            res.json(jobs);
        })
        .catch((err) => {
            res.status(400).json(err);
        });
});

router.get("/jobs/posted", jwtAuth, (req, res) => {
    const user = req.user;

    if (user.role !== "applicant") {
        return res.status(401).json({
            message: "Permission denied"
        });
    }

    Job.find()
        .then((jobs) => {
            res.json(jobs);
        })
        .catch((err) => {
            res.status(400).json(err);
        });
});

// Get a job by ID
router.get("/jobs/:id", (req, res) => {
    Job.findById(req.params.id)
        .then((job) => {
            if (!job) {
                return res.status(404).json({ message: "Job not found" });
            }
            res.json(job);
        })
        .catch((err) => {
            res.status(400).json(err);
        });
});

// Delete a job
router.delete("/jobs/:id", jwtAuth, async (req, res) => {
    try {
        const user = req.user;
        
        if (user.role !== "recruiter") {
            return res.status(401).json({
                message: "Permission to delete job denied"
            });
        }

        const jobId = req.params.id;

        // Find the job and ensure it belongs to the logged-in recruiter
        const job = await Job.findOneAndDelete({ _id: jobId, recruiterId: user._id });

        res.json({
            message: "Job deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting job:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Update a job
router.put("/jobs/:id", jwtAuth, (req, res) => {
    const user = req.user;
    if (user.role !== "recruiter") {
        return res.status(401).json({
            message: "Permission denied"
        });
    }

    const data = req.body;

    Job.findOneAndUpdate(
        { _id: req.params.id, recruiterId: user._id },
        {
            title: data.title,
            maxOpenPositions: data.maxOpenPositions,
            dateOfPosting: data.dateOfPosting,
            jobType: data.jobType,
            location: data.location,
            salary: data.salary,
            yearOfExperienceReq: data.yearOfExperienceReq,
            skills: data.skills
        },
        { new: true }
    )
        .then((job) => {
            if (!job) {
                return res.status(404).json({ message: "Job not found or you're not authorized to update this job" });
            }
            res.json({
                message: "Job updated successfully",
                job
            });
        })
        .catch((err) => {
            res.status(400).json(err);
        });
});

module.exports = router;
