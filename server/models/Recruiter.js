const mongoose = require("mongoose");

let recruiterSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  companyName: {
    type: String,
    required: true,
  },
  linkedin: {
    type: String,
  }
});

module.exports = mongoose.model("Recruiter", recruiterSchema);
