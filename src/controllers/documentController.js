import path from "node:path";
import { generateChecksum } from "../utils/checksum.js";
import fs from "node:fs/promises";
import File from "../models/File.js";
import Document from "../models/Document.js";

export const documentController = async (req, res) => {
    const { title } = req.body;
    const file = req.file;

    if (!file) {
        return res.status(400).json({ "message": "File missing" })
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

    return res.status(201).json({
        message: 'Document uploaded successfully',
        document
    })
}