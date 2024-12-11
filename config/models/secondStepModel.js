const mongoose = require("mongoose");

const authschema = mongoose.Schema({
  email: { type: String },
  otp: { type: Number },
  totalTries: {
    type: Object,
  },
});
module.exports = mongoose.model("secindstepauth", authschema);
