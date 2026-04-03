import path from "node:path";
import { generateChecksum } from "../utils/checksum.js";
import fs from "node:fs/promises";
import File from "../models/File.js";
import Document from "../models/Document.js";
import { ApiError } from "../utils/ApiError.js";
import { successResponse } from "../utils/successResponse.js";
import { getFingerprint } from "../utils/idempotency.js";
import redis from "../config/redis.js";

export const documentController = async (req, res) => {
    const { title } = req.body;
    const file = req.file;

    if (!file) {
        throw new ApiError(400, "File missing");
    }

    const checksum = await generateChecksum(file.path);

    const fingerprint = getFingerprint(req.user?.userId, title, checksum);

    const { redisKey, existingRecord } = req.idempotency;

    if (existingRecord) {
        await fs.unlink(file.path);
        if (existingRecord.fingerprint !== fingerprint) {
            throw new ApiError(409, "Idempotency key is not valid for this payload");
        }
        if (existingRecord.status === 'IN_PROGRESS') {
            throw new ApiError(400, "Duplicate request is in progress. Kindly wait!")
        }
        if (existingRecord.status === 'COMPLETED') {
            return successResponse(res, 200, null, existingRecord.data);
        }
    }

    if (redisKey) {
        const inProgressPayload = JSON.stringify({
            status: 'IN_PROGRESS',
            fingerprint
        })
        const wasSet = await redis.set(redisKey, inProgressPayload, 'EX', 600, 'NX');

        if (wasSet === null) {
            const latestRecordRaw = await redis.get(redisKey);

            if (latestRecordRaw) {
                const latestRecord = JSON.parse(latestRecordRaw);

                await fs.unlink(file.path).catch(() => { });

                if (latestRecord.fingerprint !== fingerprint) {
                    throw new ApiError(409, "Idempotency key is not valid for this payload");
                }

                if (latestRecord.status === "IN_PROGRESS") {
                    throw new ApiError(409, "Duplicate request is already in progress");
                }

                if (latestRecord.status === "COMPLETED") {
                    return successResponse(res, 200, "Success", latestRecord.data);
                }
            }
        }
    }

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

    if (redisKey) {
        const completedPayload = JSON.stringify({
            status: 'COMPLETED',
            fingerprint,
            data: document
        })
        await redis.set(redisKey, completedPayload, 'EX', 600);
    }

    req.log?.info({
        message: "Document uploaded successfully",
        userId: req.user?.userId,
        documentId: document._id.toString(),
        checksum
    });

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