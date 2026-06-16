const express  = require("express");
const router   = express.Router();
const { ask, getHistory, generateQuiz, checkQuiz } = require("../controllers/kmateController");
const { protect } = require("../middleware/auth");

router.post("/ask",           protect, ask);
router.get("/history",        protect, getHistory);
router.post("/quiz/generate", protect, generateQuiz);
router.post("/quiz/check",    protect, checkQuiz);

module.exports = router;
