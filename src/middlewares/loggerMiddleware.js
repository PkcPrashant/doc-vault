import pinoHttp from "pino-http";
import { randomUUID } from "node:crypto";

export const loggerMiddleware = pinoHttp({
    genReqId: (req, res) => {
        const requestId = req.headers['x-request-id'] || randomUUID();
        res.setHeader('x-request-id', requestId);
        return requestId;
    }
})