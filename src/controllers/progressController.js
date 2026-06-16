const db = require("../config/db");

// ---- တိုးတက်မှု အပြည့်အစုံ ကြည့်တာ ----
const getProgress = async (req, res) => {
    const userId = req.user.id;
    try {
        const [rows] = await db.query(
            `SELECT section,
                    total_questions,
                    correct_answers,
                    ROUND(correct_answers / total_questions * 100, 1) AS accuracy_percent,
                    updated_at
             FROM study_progress
             WHERE user_id = ?
             ORDER BY section`,
            [userId]
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// ---- Score summary (dashboard အတွက်) ----
const getSummary = async (req, res) => {
    const userId = req.user.id;
    try {
        // Progress per section
        const [progress] = await db.query(
            `SELECT
                SUM(total_questions)  AS total_attempted,
                SUM(correct_answers)  AS total_correct,
                ROUND(SUM(correct_answers) / SUM(total_questions) * 100, 1) AS overall_accuracy
             FROM study_progress WHERE user_id = ?`,
            [userId]
        );

        // Chat history count
        const [chats] = await db.query(
            "SELECT COUNT(*) AS total_chats FROM chat_history WHERE user_id = ?",
            [userId]
        );

        // Section breakdown
        const [sections] = await db.query(
            `SELECT section,
                    total_questions,
                    correct_answers,
                    ROUND(correct_answers / total_questions * 100, 1) AS accuracy
             FROM study_progress WHERE user_id = ?`,
            [userId]
        );

        res.json({
            overall:  progress[0],
            sections: sections,
            chats:    chats[0].total_chats
        });

    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

module.exports = { getProgress, getSummary };
