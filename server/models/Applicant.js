const mongoose = require("mongoose");

let applicantSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  location: {
    type: String,
  },
  resume: {
    type: String,
  },
  education: [{
    institution: {
      type: String,
    },
    degree: {
      type: String,
    },
    startYear: {
      type: Date,

    },
    endYear: {
      type: Date,
    },
  }],
});

module.exports = mongoose.model("Applicant", applicantSchema);
