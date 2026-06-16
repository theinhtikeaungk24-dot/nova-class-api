const express = require("express");
const router  = express.Router();
const { submitQuiz, getResults } = require("../controllers/quizController");
const { protect } = require("../middleware/auth");

router.post("/submit",  protect, submitQuiz);
router.get("/results",  protect, getResults);

module.exports = router;
