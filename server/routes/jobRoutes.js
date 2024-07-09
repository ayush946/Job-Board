const express = require("express");
const mongoose = require("mongoose");
const jwtAuth = require("../lib/jwtAuth");

// const User = require("../models/User");
const Job = require("../models/Job");

const router = express.Router();

// Craete a job
router.post("/jobs", jwtAuth, (req,res) => {
    const user = req.user;
    if(user.role != "recruiter"){
        res.status(401).json({
            message: "Permission denied"
        })
    }

    const data = res.body;

    let job = new Job({
        recruiterId: user._id ,
        title: data.title ,
        maxOpenPositions: data.maxPosition,
        dateOfPosting: data.dateOfPosting,
        jobType:data.jobType,
        location:data.location,
        salary:data.salary,
        yearOfExperienceReq: data.yearOfExperience
    })

    job.save()
    .then(() => {
        res.json({message: "Job added successfully"})
    })
    .catch( (err) =>{
        res.status(400).json(err);
    });
})

// Get all jobs posted by the recruiter
router.get("/jobs", jwtAuth, (req, res) => {
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

// delete a job
router.delete("'jobs/:id", jwtAuth, (req,res) => {
    const user =req.user;
    if(user.role != "recruiter"){
        res.status(401).json({
            message: "Permission to delete job denied"
        })
    }
    Job.findOneAndDelete({
        _id: req.params.id,
        recruiterId: user.id,
      })
        .then((job) => {
          if (job === null) {
            res.status(401).json({
              message: "You don't have permissions to delete the job",
            });
            return;
          }
          res.json({
            message: "Job deleted successfully",
          });
        })
        .catch((err) => {
          res.status(400).json(err);
        });
})

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
          maxOpenPositions: data.maxPosition,
          dateOfPosting: data.dateOfPosting,
          jobType: data.jobType,
          location: data.location,
          salary: data.salary,
          yearOfExperienceReq: data.yearOfExperience
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