const express = require("express");
const jwtAuth = require("../lib/jwtAuth");

const JobApplication = require("../models/JobApplication");
const Applicant = require("../models/Applicant");
const Job = require("../models/Job");
const sendJobApplicationConfirmation = require('../lib/email');

const router = express.Router();

// Create an JobApplication
router.post("/new", jwtAuth, async (req, res) => {
  try {
    const user = req.user;
    if (user.role !== "applicant") {
      return res.status(401).json({
        message: "You don't have permissions to apply for a job",
      });
    }
    const jobId = req.body.jobId;

    // Find the applicant based on userId
    const applicant = await Applicant.findOne({ userId: user._id });
    if (!applicant) {
      return res.status(404).json({
        message: "Applicant not found",
      });
    }

    // Find the job based on jobId
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    // Check if user has already applied
    const appliedApplication = await JobApplication.findOne({
      applicantId: applicant._id,
      jobId: jobId,
      status: { $nin: ["Deleted", "Withdrawn"] },
    });

    if (appliedApplication) {
      return res.status(400).json({
        message: "You have already applied for this job",
      });
    }

     // Create new application
     const application = new JobApplication({
      applicantId: applicant._id,
      recruiterId: job.recruiterId,
      jobId: job._id,
      status: "Applied",
    });

    await application.save();

    sendJobApplicationConfirmation(user, job)
    return res.json({
      message: "Job application successful",
    });
  }
  catch (error){
    res.status(500).json({ message: error.message });
  }
});

// Get All Applications of a particular applicant (My jobs section)
router.get("/all", jwtAuth, async (req, res) => {
    
  try {
    const user = req.user;
    const userId = user._id;

    const app = await Applicant.findOne({ userId: userId })  

    // const applications =  await JobApplication.find({ applicantId: app._id });
    
    applications = await JobApplication.find({ applicantId: app._id })
    .populate('jobId')
    .populate({
      path: 'jobId',
      populate: {
        path: 'recruiterId',
        model: 'Recruiter'
      }
    })
    .populate('applicantId')
    .populate({
      path: 'applicantId',
      populate: {
        path: 'userId',
        model: 'User',
        select: 'name' 
      }
    });
    
    console.log(applications)
    res.json(applications);

} catch(err) {
        res.status(400).json(err);
    };
});

// View JobApplication by ID
// todo: test
router.get("/view/:id", jwtAuth, async (req, res) => {
  try {
    const applicationId = req.params.id;
    const application = await JobApplication.findById(applicationId).populate('applicantId jobId');
    if (!application) {
      return res.status(404).json({ message: "JobApplication not found" });
    }
    res.status(200).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Update status of application
router.put("/update/:id", jwtAuth, async (req, res) => {
  try {
    const user = req.user;
    const applicationId = req.params.id;
    const status = req.body.status;

    const application = await JobApplication.findOne({ _id: applicationId }).populate("jobId");

    if (!application) {
      return res.status(404).json({ message: "JobApplication not found" });
    }

    if (user.role === "applicant") {
      await handleApplicantActions(application, status, res);
    } else {
      return res.status(401).json({ message: "Unauthorized access" });
    }
  } catch (err) {
    console.error("Error updating application:", err);
    res.status(400).json({ message: "An error occurred" });
  }
});

// Function to handle applicant actions
async function handleApplicantActions(application, status, res) {
  try {
    if (status === "Withdrawn") {
      // Update application status to withdrawn
      
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
