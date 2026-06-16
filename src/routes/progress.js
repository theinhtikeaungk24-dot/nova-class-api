const express = require("express");
const router  = express.Router();
const { getProgress, getSummary } = require("../controllers/progressController");
const { protect } = require("../middleware/auth");

router.get("/",        protect, getProgress);
router.get("/summary", protect, getSummary);

module.exports = router;
