const express = require("express");

const { getReport, postReport } = require("../controllers/Submissions");

const router = express.Router();

router.get("/submissions", getReport);
router.post("/submissions", postReport);

module.exports = router;
