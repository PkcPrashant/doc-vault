import express from "express";
import env from "./config/env.js";
import { loggerMiddleware } from "./middlewares/logger.js";
import loginRoutes from "./routes/loginRoutes.js";
import documentRoutes from "./routes/documentRoutes.js";
import { ApiError } from "./utils/ApiError.js";
import { successResponse } from "./utils/successResponse.js";
import helmet from "helmet";
import cors from 'cors';
import { errorLogger } from "./utils/loghandler.js";

const app = express();

app.use(helmet());
app.use(cors({ origin: "*" }))

app.use(loggerMiddleware);
app.use(express.json({ limit: '1mb' }));

app.get("/health", (req, res) => {
    return successResponse(res, 200, "OK", null, { env: env.nodeEnv })
})

app.use("/login", loginRoutes);
app.use("/document", documentRoutes);

app.use((req, res, next) => {
    next(new ApiError(404, "Route not found"));
})

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;

    errorLogger.error({
        statusCode,
        message: err.message,
        details: err.details || null,
        path: req.path,
        method: req.method,
        requestId: req.id,
        stack: err.stack
    })

    return res.status(statusCode)
        .json({
            success: false,
            message: err.message || "Internal Server Error",
            details: env.nodeEnv === 'prod' ? null : err.details
        })
})

export default app;