const express = require("express");

const { getQuery, postQuery, putQuery } = require("../controllers/AskQuery");

const router = express.Router();

router.get("/queries", getQuery);
router.post("/queries", postQuery);
router.put("/queries", putQuery);

module.exports = router;
