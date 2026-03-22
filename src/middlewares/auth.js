import { ApiError } from "../utils/ApiError.js";
import { verifyToken } from "../utils/jwt.js";

export const authMiddleware = (req, res, next) => {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
        throw new ApiError(403, "Authorization header missing");
    }

    const parts = authorizationHeader.split(' ');

    if (parts.length != 2 || parts[0] !== 'Bearer') {
        throw new ApiError(403, "Invalid authorization header format");
    }

    const token = parts[1];

    try {
        const payload = verifyToken(token);
        req.user = payload;
        next();
    } catch (error) {
        throw new ApiError(403, "Token expired or invalid token");
    }
}