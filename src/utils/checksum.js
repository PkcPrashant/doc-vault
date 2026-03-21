import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";

export const generateChecksum = (filepath) => {
    return new Promise((resolve, reject) => {
        const hash = createHash("sha256");
        const file = createReadStream(filepath);

        file.on('data', (chunk) => hash.update(chunk));
        file.on('end', () => resolve(hash.digest('hex')));
        file.on('error', (error) => reject(error))
    })
}