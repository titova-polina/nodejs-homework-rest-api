const mongoose = require("mongoose");
const bCrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  password: {
    type: String,
    required: [true, "Set password for user"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter",
  },
  token: String,
});

userSchema.methods.setPassword = function (password) {
  console.log("AAAAAAAAA", password);
  this.password = bCrypt.hashSync(password, bCrypt.genSaltSync(6));
};

userSchema.methods.verifyPassword = function (password) {
  return bCrypt.compareSync(password, this.password);
};

module.exports = mongoose.model("user", userSchema);
