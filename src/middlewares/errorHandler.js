const errorHandler = (err, req, res, next) => {
    // Log the error for debugging purposes
    console.error(`[Error] ${err.message}`);
    console.error(err.stack);

    // Determine the status code (default to 500 Internal Server Error)
    const statusCode = err.statusCode || 500;

    // Send a consistent JSON response
    res.status(statusCode).json({
        success: false,
        error: {
            message: err.message || 'An unexpected error occurred on the server.',
        }
    });
};

module.exports = errorHandler;