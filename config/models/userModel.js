const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    githubRepo: {
      type: String,
      required: true,
      trim: true,
    },
    hostedList: {
      type: String,
      required: false,
      trim: true,
    },
    query: {
      type: String,
      required: true,
      trim: true,
    },
    video: {
      type: String,
      required: true,
      trim: true,
    },
    report: {
      type: String,
      required: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, 
  }
);

const User = mongoose.model("AllStudens", userSchema);

module.exports = User;
