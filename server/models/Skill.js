const mongoose = require("mongoose");

let skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
});

module.exports = mongoose.model("Skill", skillSchema);
