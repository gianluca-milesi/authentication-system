const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) return res.sendStatus(401); //no token

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; //user.id, user.email
        next();
    } catch (err) {
        res.sendStatus(403); //token non valido
    }
};

module.exports = authMiddleware;