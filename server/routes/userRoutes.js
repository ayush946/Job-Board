const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const authKeys = require("../lib/authKeys");
const jwtAuth = require("../lib/jwtAuth");

const User = require("../models/User");
const JobApplicant = require("../models/Applicant");
const Recruiter = require("../models/Recruiter");

const router = express.Router();

router.post("/signup", async (req, res) => {
  const data = req.body;
  
  const user = new User({
    email: data.email,
    password: data.password,
    name: data.name,
    contact: data.contact,
    role: data.role,
  });

  try {
    await user.save();

    const userDetails = user.role === "recruiter"
      ? new Recruiter({
          userId: user._id,
          companyName: data.companyName,
          linkedin: data.linkedin
        })
      : new JobApplicant({
          userId: user._id,
          location: data.location,
          resume: data.resume,
          education: {
            institution: data.institution,
            degree: data.degree,
            startYear: data.startYear,
            endYear: data.endYear
          }
        });

    await userDetails.save();

    const token = jwt.sign({ _id: user._id }, authKeys.jwtSecretKey);
    res.json({
      token: token,
      type: user.role,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post("/login", (req, res, next) => {
  passport.authenticate(
    "local",
    { session: false },
    async (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        res.status(401).json(info);
        return;
      }
      try {
        const token = jwt.sign({ _id: user._id }, authKeys.jwtSecretKey);
        res.json({
          token: token,
          type: user.role,
        });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
  )(req, res, next);
});

// get user's personal details
router.get("/user", jwtAuth, (req, res) => {
  const user = req.user;
  if (user.role === "recruiter") {
    Recruiter.findOne({ userId: user._id })
      .then((recruiter) => {
        if (recruiter == null) {
          res.status(404).json({
            message: "User does not exist",
          });
          return;
        }
        res.json(recruiter);
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  } else {
    JobApplicant.findOne({ userId: user._id })
      .then((jobApplicant) => {
        if (jobApplicant == null) {
          res.status(404).json({
            message: "User does not exist",
          });
          return;
        }
        res.json(jobApplicant);
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  }
});

// get user details from id
router.get("/user/:id", jwtAuth, (req, res) => {
  User.findOne({ _id: req.params.id })
    .then((userData) => {
      if (userData === null) {
        res.status(404).json({
          message: "User does not exist",
        });
        return;
      }

      if (userData.role === "recruiter") {
        Recruiter.findOne({ userId: userData._id })
          .then((recruiter) => {
            if (recruiter === null) {
              res.status(404).json({
                message: "User does not exist",
              });
              return;
            }
            res.json(recruiter);
          })
          .catch((err) => {
            res.status(400).json(err);
          });
      } else {
        JobApplicant.findOne({ userId: userData._id })
          .then((jobApplicant) => {
            if (jobApplicant === null) {
              res.status(404).json({
                message: "User does not exist",
              });
              return;
            }
            res.json(jobApplicant);
          })
          .catch((err) => {
            res.status(400).json(err);
          });
      }
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

module.exports = router;
