import express from "express"
import { ipLimiter } from "../middlewares/rateLimit.js";
import { loginController } from "../controllers/loginController.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

router.post("/", ipLimiter, asyncHandler(loginController))

export default router;