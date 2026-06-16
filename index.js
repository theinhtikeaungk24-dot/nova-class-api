const express = require("express");
const cors    = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth",     require("./src/routes/auth"));
app.use("/api/kmate",    require("./src/routes/kmate"));
app.use("/api/quiz",     require("./src/routes/quiz"));
app.use("/api/progress", require("./src/routes/progress"));

// Health check
app.get("/", (req, res) => {
    res.json({ status: "✅ NOVA CLASS API running", version: "1.0.0" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 NOVA CLASS API running on port ${PORT}`);
    console.log(`   http://localhost:${PORT}`);
});
