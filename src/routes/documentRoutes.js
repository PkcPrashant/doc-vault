import express from "express"
import { userLimiter } from "../middlewares/rateLimit.js";
import { authMiddleware } from "../middlewares/auth.js";
import { uploadMiddleware } from "../middlewares/upload.js";
import { documentController, getDocumentsController } from "../controllers/documentController.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { documentValidator, getDocumentsSchema } from "../validations/document.validation.js";
import { validatorMiddleware } from "../middlewares/validator.js";
import { idempotencyMiddleware } from "../middlewares/idempotency.js";

const router = express.Router();

router.post("/", 
    authMiddleware, 
    userLimiter,    
    uploadMiddleware, 
    validatorMiddleware(documentValidator),
    asyncHandler(documentController)
)

router.get("/getAllDocuments", 
    authMiddleware, 
    idempotencyMiddleware,
    userLimiter,    
    validatorMiddleware(getDocumentsSchema),
    asyncHandler(getDocumentsController)
)

export default router;