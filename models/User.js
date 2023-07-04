const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,
    age: Number,
  },
  { timestamps: true }
);

module.exports = User = mongoose.model("User", userSchema);
