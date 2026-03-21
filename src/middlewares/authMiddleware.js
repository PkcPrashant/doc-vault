import { verifyToken } from "../utils/jwt.js";

export const authMiddleware = (req, res, next) => {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
        return res.status(403).json({ message: "Authorization header missing" });
    }

    console.log("Header: ", authorizationHeader)

    const parts = authorizationHeader.split(' ');

    if (parts.length != 2 || parts[0] !== 'Bearer') {
        return res.status(403).json({ message: "Invalid authorization header format" });
    }

    const token = parts[1];

    try {
        const payload = verifyToken(token);
        req.user = payload;
        next();
    } catch (error) {
        res.json(403).json({ message: "Token expired or invalid token" })
    }
}