const db = require("../config/db");

// ---- Quiz အဖြေ submit လုပ်တာ ----
const submitQuiz = async (req, res) => {
    const { question_id, user_answer } = req.body;
    const userId = req.user.id;

    if (!question_id || user_answer === undefined)
        return res.status(400).json({ message: "question_id and user_answer required" });

    try {
        // မေးခွန်းနဲ့ မှန်တဲ့ အဖြေ ရှာတယ်
        const [questions] = await db.query(
            "SELECT id, answer, section FROM topik_questions WHERE id = ?",
            [question_id]
        );

        if (questions.length === 0)
            return res.status(404).json({ message: "Question not found" });

        const question   = questions[0];
        const is_correct = parseInt(user_answer) === parseInt(question.answer) ? 1 : 0;

        // Quiz result သိမ်းတယ်
        await db.query(
            "INSERT INTO quiz_results (user_id, question_id, user_answer, is_correct) VALUES (?, ?, ?, ?)",
            [userId, question_id, user_answer, is_correct]
        );

        // Progress update လုပ်တယ်
        const [progress] = await db.query(
            "SELECT * FROM study_progress WHERE user_id = ? AND section = ?",
            [userId, question.section]
        );

        if (progress.length === 0) {
            await db.query(
                "INSERT INTO study_progress (user_id, section, total_questions, correct_answers) VALUES (?, ?, 1, ?)",
                [userId, question.section, is_correct]
            );
        } else {
            await db.query(
                "UPDATE study_progress SET total_questions = total_questions + 1, correct_answers = correct_answers + ? WHERE user_id = ? AND section = ?",
                [is_correct, userId, question.section]
            );
        }

        res.json({
            correct:        is_correct === 1,
            your_answer:    user_answer,
            correct_answer: question.answer,
            message:        is_correct === 1 ? "✅ Correct!" : "❌ Wrong answer"
        });

    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// ---- Quiz results ကြည့်တာ ----
const getResults = async (req, res) => {
    const userId = req.user.id;
    try {
        const [rows] = await db.query(
            `SELECT qr.id, tq.section, tq.question_no, tq.question,
                    qr.user_answer, qr.is_correct, qr.answered_at
             FROM quiz_results qr
             JOIN topik_questions tq ON qr.question_id = tq.id
             WHERE qr.user_id = ?
             ORDER BY qr.answered_at DESC
             LIMIT 20`,
            [userId]
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

module.exports = { submitQuiz, getResults };
