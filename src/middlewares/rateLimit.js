import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import redis from "../config/redis.js";

const createRedisStore = () => {
    return new RedisStore({ sendCommand: (...args) => redis.call(...args) })
}

export const ipLimiter = rateLimit({
    store: createRedisStore(),
    windowMs: 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        message: "Too many requests. Try again later!"
    }
})

export const userLimiter = rateLimit({
    store: createRedisStore(),
    windowMs: 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => req?.user?.userId || ipKeyGenerator(req.ip),
    message: {
        message: "Too many requests. Try again later!"
    }
})