var express = require("express");
const Feedback = require("../config/models/studentFeedback");
var router = express.Router();
router.get("/queries", async (req, res) => {
  var dbres = await Feedback.find({});
  return res.send({ status: true, count: dbres.length });
});
module.exports = router;
