import pinoHttp from "pino-http";
import { randomUUID } from "node:crypto";
import { appLogger } from "../utils/loghandler.js";

export const loggerMiddleware = pinoHttp({
    logger: appLogger,
    genReqId: (req, res) => {
        const requestId = req.headers['x-request-id'] || randomUUID();
        req.id = requestId;
        res.setHeader('x-request-id', requestId);
        return requestId;
    }
})