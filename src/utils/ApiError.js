export class ApiError extends Error {
    constructor (statusCode = 400, message = 'Bad Request', details = null) {
        super(message);
        this.statusCode = statusCode;
        this.details = details;
        this.isOperational = true;
    }
}