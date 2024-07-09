const express = require("express");
const mongoose = require("mongoose");
const JobApplication = require("../models/JobApplication");

const router = express.Router();

// Create an JobApplication
router.post("/new", async (req, res) => {
  try {
    const user = req.user;
    if (user.type !== "applicant") {
      return res.status(401).json({
        message: "You don't have permissions to apply for a job",
      });
    }
    const jobId = req.params.id;

    // Check if user has already applied
    // todo: check if i should use user or applicant
    const appliedApplication = await JobApplication.findOne({
      applicantId: applicant._id,
      jobId: jobId,
      status: { $nin: ["Deleted"] },
    });

    if (appliedApplication) {
      return res.status(400).json({
        message: "You have already applied for this job",
      });
    }

     // Create new application
     const application = new JobApplicationApplication({
      userId: user._id,
      recruiterId: job.userId,
      jobId: job._id,
      status: "Applied",
    });

    await application.save();

    return res.json({
      message: "Job application successful",
    });
  }
  catch (error){
    res.status(500).json({ message: error.message });
  }
});

// Get All Applications of a particular applicant (My jobs section)
router.get("/all", async (req, res) => {
  try {
    const user = req.user;
    const userType = user.type;
    const userId = user._id;

    let query = {};

    if (userType === "recruiter") {
      query.recruiterId = userId;
    } else if (userType === "applicant") {
      query.userId = userId;
    }

    const applications = await JobApplication.find(query)
      .populate({
        path: "userId",
        model: "JobApplicant",
      })
      .populate({
        path: "jobId",
        model: "Job",
      })
      .populate({
        path: "recruiterId",
        model: "Recruiter",
      })
      .sort({ dateOfApplication: -1 });

    res.json(applications);
  } catch (err) {
    console.error("Error fetching applications:", err);
    res.status(400).json({ message: "An error occurred" });
  }
});

// View JobApplication by ID
// todo: test
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


// Update status of application
router.put("/:id/update", async (req, res) => {
  try {
    const user = req.user;
    const id = req.params.id;
    const status = req.body.status;

    const application = await JobApplication.findOne({ _id: id }).populate("jobId");

    if (!application) {
      return res.status(404).json({ message: "JobApplication not found" });
    }

    // Handle different scenarios based on user type
    if (user.type === "recruiter") {
      await handleRecruiterActions(user, application, status, res);
    } else if (user.type === "applicant") {
      await handleApplicantActions(user, application, status, res);
    } else {
      return res.status(401).json({ message: "Unauthorized access" });
    }
  } catch (err) {
    console.error("Error updating application:", err);
    res.status(400).json({ message: "An error occurred" });
  }
});

// Function to handle recruiter actions
async function handleRecruiterActions(user, application, status, res) {
  try {
    if (status === "Deleted") {
      await JobApplication.updateMany(
        { jobId: application.jobId, status: { $nin: ["Deleted"] } },
        { $set: { status: "Deleted" } }
      );

      // Delete the job
      await Job.deleteOne({ _id: application.jobId });

      return res.json({ message: "Job and associated applications deleted successfully" });
    }
  } catch (err) {
    throw err;
  }
}

// Function to handle applicant actions
async function handleApplicantActions(user, application, status, res) {
  try {
    if (status === "Withdrawn") {
      // Update application status to cancelled
      await JobApplication.updateOne({ _id: application._id }, { $set: { status: "Withdrawn" } });
      return res.json({ message: "JobApplication Withdrawn successfully" });
    } else {
      return res.status(401).json({ message: "Unauthorized action" });
    }
  } catch (err) {
    throw err;
  }
}

module.exports = router;
