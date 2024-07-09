const mongoose = require("mongoose");

let applicantSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  location: {
    type: String,
    required: true,
  },
  resume: {
    type: String,
    required: true,
  },
  education: [{
    institution: {
      type: String,
      required: true,
    },
    degree: {
      type: String,
      required: true,
    },
    startYear: {
      type: Date,
      required: true,
    },
    endYear: {
      type: Date,
      required: true,
    },
  }],
});

module.exports = mongoose.model("Applicant", applicantSchema);
