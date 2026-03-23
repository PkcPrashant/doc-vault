import redis from "../config/redis.js";

export const idempotencyMiddleware = async (req, res, next) => {
    const idempotencyKey = req.headers['x-idempotency-key'];

    if(!idempotencyKey) return next();

    const key = `idempotency:${req.user?.userId}:${idempotencyKey}`;

    const data = await redis.get(key);

    req.idempotency = {
        redisKey: key,
        clientKey: idempotencyKey,
        existingRecord: data ? JSON.parse(data) : null
    }

    return next();
}