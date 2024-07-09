const mongoose = require("mongoose");

let applicantSkillSchema = new mongoose.Schema({
  applicantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Applicant',
    required: true,
  },
  skillId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill',
    required: true,
  },
});

module.exports = mongoose.model("ApplicantSkill", applicantSkillSchema);
