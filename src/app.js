import express from "express";
import env from "./config/env.js";
import { loggerMiddleware } from "./middlewares/loggerMiddleware.js";
import loginRoutes from "./routes/loginRoutes.js";
import documentRoutes from "./routes/documentRoutes.js";

const app = express();

app.use(loggerMiddleware);
app.use(express.json());

app.get("/health", (req, res) => {
    return res.status(200).json({ message: "OK", env: env.nodeEnv })
})

app.use("/login", loginRoutes);
app.use("/document", documentRoutes);

app.use((req, res, next) => {
    return res.status(404).json({message: "Page you are looking does not exist"})
})

app.use((err, req, res, next) => {
    return res.status(err.statusCode || 500).json({message: err.message || "Page you are looking does not exist"})
})

export default app;