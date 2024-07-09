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
    enum: ['Pending', 'Shortlisted', 'Rejected', 'Deleted'],
    default: 'Pending',
  },
});

module.exports = mongoose.model("JobApplication", applicationSchema);
