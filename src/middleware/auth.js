const jwt = require("jsonwebtoken");

// Login မလုပ်ဘဲ API မသုံးနိုင်အောင် ကာကွယ်တဲ့ middleware
const protect = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Login required" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch {
        res.status(401).json({ message: "Invalid or expired token" });
    }
};

module.exports = { protect };
