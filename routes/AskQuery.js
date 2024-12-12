const express = require("express");

const { getQuery,postQuery } = require("../controllers/AskQuery");

const router = express.Router();


router.get("/queries", getQuery);
router.post("/queries", postQuery);


module.exports = router;
 