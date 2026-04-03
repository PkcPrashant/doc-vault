import multer from "multer";
import { ApiError } from "../utils/ApiError.js";

const storage = multer.diskStorage({
    destination: 'uploads',
    filename: (req, file, cb) => {
        cb(null, `${Date.now()} - ${file.originalname}`)
    }
})

export const uploadMiddleware = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ["image/jpeg", "application/pdf"];
        const mimetype = file.mimetype;
        if(!allowedTypes.includes(mimetype)) {
            return cb(new ApiError(400, "Filetype not supported"), false);
        }
        cb(null, true);
    }
}).single('file')