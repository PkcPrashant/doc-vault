import express from "express"
import { ipLimiter } from "../middlewares/rateLimit.js";
import { loginController } from "../controllers/loginController.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validatorMiddleware } from "../middlewares/validator.js";
import { authValidator } from "../validations/auth.validation.js";

const router = express.Router();

router.post("/", ipLimiter, validatorMiddleware(authValidator), asyncHandler(loginController))

export default router;