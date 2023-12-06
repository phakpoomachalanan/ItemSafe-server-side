export const errorMiddleware = (error, req, res, next) => {
    const status = error.status || 404
    const message = error.message || 'Something went wrong'
    res
        .status(status)
        .json({
            message
        })
}