import pino from 'pino'
import path from "path"
import fs from 'fs'

const logsDir = path.resolve("logs");

if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true })
}

const appDestination = pino.destination({
    dest: path.resolve(logsDir, "app.log"),
    sync: true
})

export const appLogger = pino(
    {
        level: 'info',
        timestamp: pino.stdTimeFunctions.isoTime
    },
    appDestination
)

const errorDestination = pino.destination({
    dest: path.resolve(logsDir, "error.log"),
    sync: true
})

export const errorLogger = pino(
    {
        level: 'error',
        timestamp: pino.stdTimeFunctions.isoTime
    },
    errorDestination
)

