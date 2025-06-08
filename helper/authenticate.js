const jwt = require("jsonwebtoken");

// Middleware
const authenticate = async (req, res, next) => {
    const token = req.cookies.login;
    if (!token) return res.status(401).send("Access denied");
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = payload;
        next();
    } catch {
        res.status(400).send("Invalid token");
    }
};

module.exports = { authenticate };
