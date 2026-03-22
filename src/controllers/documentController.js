import path from "node:path";
import { generateChecksum } from "../utils/checksum.js";
import fs from "node:fs/promises";
import File from "../models/File.js";
import Document from "../models/Document.js";
import { ApiError } from "../utils/ApiError.js";
import { successResponse } from "../utils/successResponse.js";

export const documentController = async (req, res) => {
    const { title } = req.body;
    const file = req.file;

    if (!file) {
        throw new ApiError(400, "File missing");
    }

    const checksum = await generateChecksum(file.path);
    const existingFile = await File.findOne({ checksum })

    let fileDoc;

    if (existingFile) {
        await fs.unlink(file.path);
        fileDoc = existingFile;
    } else {
        const ext = path.extname(file.originalname);
        const newPath = `uploads/${checksum}${ext}`
        await fs.rename(file.path, newPath);

        fileDoc = await File.create({
            userId: req?.user?.userId,
            name: file.originalname,
            mimeType: file.mimetype,
            size: file.size,
            path: newPath,
            checksum: checksum
        })
    }

    const document = await Document.create({
        title: title,
        userId: req?.user?.userId,
        fileId: fileDoc._id
    })

    return successResponse(res, 201, "Document uploaded successfully", document);
}

export const getDocumentsController = async (req, res) => {
    const { page, size } = req.body;

    const skip = (page - 1) * size;
    const filter = { userId: req.user.userId };
    const [documents, total] = await Promise.all([
        Document.find(filter)
            .select('title createdAt userId fileId -_id')
            .sort({ createdAt: -1 })
            .skip(skip).limit(size)
            .populate('userId', 'username -_id')
            .populate('fileId', 'name mimeType size -_id')
            .lean(),
        Document.countDocuments(filter)
    ]);

    const meta = {
        page,
        size,
        total,
        totalPages: Math.ceil(total / size)
    }

    return successResponse(res, 200, "Success", documents, { meta });
}