export const successResponse = (res, statusCode = 200, message = 'Success', data = {}, ...restProps) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
        ...Object.assign({}, ...restProps)
    })
}