const mongoose = require("mongoose");

let schema = new mongoose.Schema(
  {
    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Recruiter',
    },
    title: {
      type: String,
      required: true,
    },
    maxOpenPositions: {
      type: Number,
      validate: [
        {
          validator: Number.isInteger,
          message: "maxOpenPositions should be an integer",
        },
        {
          validator: function (value) {
            return value > 0;
          },
          message: "maxOpenPositions should be greater than 0",
        },
      ],
    },
    dateOfPosting: {
      type: Date,
      default: Date.now,
    },
    jobType: {
        type: String,
        required: true,
        enum: ["Full time", "Internship", "Part-time"],
        message: "Job type must be either 'Full time', 'Internship', or 'Part-time'",
    },
    location: {
        type: String,
        required: true,
        enum: ["Remote", "On-site", "Hybrid"],
        message: "Job location must be either 'Remote', 'On-site', or 'Hybrid'",
    },
    salary: {
      type: Number,
      validate: [
        {
          validator: Number.isInteger,
          message: "Salary should be an integer",
        },
        {
          validator: function (value) {
            return value >= 0;
          },
          message: "Salary should be positive",
        },
      ],
    },
    yearsOfExperienceReq: {
      type: Number,
      validate: [
        {
          validator: Number.isInteger,
          message: "yearsOfExperience should be an integer",
        },
        {
          validator: function (value) {
            return value >= 0;
          },
          message: "yearsOfExperienceReq should be positive",
        },
      ],
    },
    skills: [{
      type: String,
      required: true,
    }],
  },
  
  { collation: { locale: "en" } }
);

module.exports = mongoose.model("Job", schema);
