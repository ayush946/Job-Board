const mongoose = require("mongoose");

let applicationSchema = new mongoose.Schema({
  applicantId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Applicant',
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Job',
  },
  dateOfApplication: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['Applied', 'Deleted', 'Withdrawn'],
    default: 'Applied',
  },
});

module.exports = mongoose.model("JobApplication", applicationSchema);
