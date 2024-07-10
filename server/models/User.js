const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("mongoose-type-email");

let schema = new mongoose.Schema(
  {
    email: {
      type: mongoose.SchemaTypes.Email,
      unique: true,
      lowercase: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    contact: {
      type: String,
    },
    role: {
      type: String,
      enum: ["recruiter", "applicant"],
      required: true,
    },
  },
  { collation: { locale: "en" } }
);

// Password hashing before saving the user document
schema.pre("save", function (next) {
  let user = this;

  // If the password is not modified, proceed to the next middleware
  if (!user.isModified("password")) {
    return next();
  }

  // Generate a salt and hash the password
  bcrypt.hash(user.password, 10, (err, hash) => {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  });
});

// Method to verify password upon login
schema.methods.login = function (password) {
  let user = this;

  return new Promise((resolve, reject) => {
    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        return reject(new Error("Error comparing passwords"));
      }
      if (result) {
        resolve();
      } else {
        reject(new Error("Invalid password"));
      }
    });
  });
};

module.exports = mongoose.model("User", schema);
