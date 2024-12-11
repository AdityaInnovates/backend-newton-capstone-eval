const express = require("express");

const { fetchStudentlist } = require("../controllers/Studentlist");

const { addStudentlist } = require("../controllers/Studentlist");

// const {updateStudentlist} = require('../controllers/Studentlist')

const router = express.Router();

router.get("/", fetchStudentlist);
router.post("/", addStudentlist);

module.exports = router;
