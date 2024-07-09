const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const authKeys = require("../lib/authKeys");

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
          education: data.education,
          degree: data.degree,
          startYear: data.startYear,
          endYear: data.endYear,
        });

    await userDetails.save();

    const token = jwt.sign({ _id: user._id }, authKeys.jwtSecretKey);
    res.json({
      token: token,
      type: user.role,
    });
  } catch (err) {
    if (user._id) {
      await User.findByIdAndDelete(user._id);
    }
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

module.exports = router;