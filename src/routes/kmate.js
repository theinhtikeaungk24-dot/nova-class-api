const express  = require("express");
const router   = express.Router();
const { ask, getHistory, generateQuiz, checkQuiz, generateExam, checkExam, listRealExams, generateRealExam, checkRealExam } = require("../controllers/kmateController");
const { protect } = require("../middleware/auth");

router.post("/ask",           protect, ask);
router.get("/history",        protect, getHistory);
router.post("/quiz/generate", protect, generateQuiz);
router.post("/quiz/check",    protect, checkQuiz);
router.post("/exam/generate", protect, generateExam);
router.post("/exam/check",    protect, checkExam);
router.get("/exam/real/list",     protect, listRealExams);
router.post("/exam/real/generate", protect, generateRealExam);
router.post("/exam/real/check",    protect, checkRealExam);

module.exports = router;
