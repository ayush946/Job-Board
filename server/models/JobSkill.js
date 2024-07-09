const mongoose = require("mongoose");

let jobSkillSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true,
  },
  skillId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill',
    required: true,
  },
});

module.exports = mongoose.model("JobSkill", jobSkillSchema);
