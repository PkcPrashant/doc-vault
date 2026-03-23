import {createHash} from "node:crypto"

export const getFingerprint = (userId, title, fileChecksum) => {
    const payload = JSON.stringify({
        userId, title, fileChecksum
    })
    return createHash('sha256').update(payload).digest('hex');
}