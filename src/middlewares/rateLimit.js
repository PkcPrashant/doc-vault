import rateLimit, { ipKeyGenerator } from "express-rate-limit";

export const ipLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        message: "Too many requests. Try again later!"
    }
})

export const userLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => req?.user?.userId || ipKeyGenerator(req.ip),
    message: {
        message: "Too many requests. Try again later!"
    }
})