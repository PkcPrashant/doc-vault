import dotenv from 'dotenv'
import path from "node:path"
import { fileURLToPath } from 'node:url';

const nodeEnv = process.env.NODE_ENV ?? "dev";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.resolve(__dirname, "./env/.env") })

dotenv.config({ path: path.resolve(__dirname, `./env/.env.${nodeEnv}`) })

const required = (key) => {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Missing required environment variable: ${key}`)
    }
    return value
}

const env = {
    nodeEnv,
    port: process.env.PORT ? Number(process.env.PORT) : 3002,
    mongoUri: required("MONGO_URI"),
    jwtAccessToken: required("JWT_ACCESS_TOKEN"),
    jwtAccessTtl: process.env.JWT_ACCESS_TTL ?? "15m"
}

export default env;