import express from "express"
import { userLimiter } from "../middlewares/rateLimit.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { uploadMiddleware } from "../middlewares/uploadMiddleware.js";
import { documentController } from "../controllers/documentController.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

router.post("/", 
    authMiddleware, 
    userLimiter, 
    uploadMiddleware, 
    asyncHandler(documentController)
)

export default router;