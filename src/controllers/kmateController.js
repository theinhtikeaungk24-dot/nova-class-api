const axios = require("axios");
const db    = require("../config/db");
require("dotenv").config();

const AI_SERVICE = "http://localhost:8082";

// ---- K.Mate ask ----
const ask = async (req, res) => {
    const { question } = req.body;
    const userId = req.user.id;

    if (!question)
        return res.status(400).json({ message: "Question is required" });

    try {
        // Python AI Service ကို ခေါ်တယ်
        const aiRes = await axios.post(`${AI_SERVICE}/ask`, { question });
        const answer = aiRes.data.answer || "No answer";

        // Chat history MySQL ထဲ သိမ်းတယ်
        await db.query(
            "INSERT INTO chat_history (user_id, question, answer) VALUES (?, ?, ?)",
            [userId, question, answer]
        );

        res.json({ question, answer });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "AI error", error: err.message });
    }
};

// ---- Chat history ----
const getHistory = async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT question, answer, created_at FROM chat_history WHERE user_id = ? ORDER BY created_at DESC LIMIT 20",
            [req.user.id]
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// ---- Generate Quiz ----
const generateQuiz = async (req, res) => {
    const { topic = "mixed", count = 5 } = req.body;
    try {
        const aiRes = await axios.post(`${AI_SERVICE}/quiz/generate`, { topic, count });
        res.json(aiRes.data);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Quiz generation error", error: err.message });
    }
};

// ---- Check Quiz Answers ----
const checkQuiz = async (req, res) => {
    const { questions, answers, language = "English" } = req.body;
    const userId = req.user.id;
    try {
        const aiRes = await axios.post(`${AI_SERVICE}/quiz/check`, { questions, answers, language });
        const { score, total } = aiRes.data;

        // Save score to DB
        await db.query(
            "INSERT INTO quiz_results (user_id, score, total_questions, created_at) VALUES (?, ?, ?, NOW())",
            [userId, score, total]
        ).catch(() => {}); // silently skip if table structure differs

        res.json(aiRes.data);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Quiz check error", error: err.message });
    }
};

module.exports = { ask, getHistory, generateQuiz, checkQuiz };
