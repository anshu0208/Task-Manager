class ErrorHandler extends Error{
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

export const errorMiddleware = (err, req, res, next) => {
    // 1. Set defaults (must be done first)
    err.message = err.message || "Internal Server Error";
    err.statusCode = err.statusCode || 500;

    // 2. Specific Error Handlers (re-assigns err to a new ErrorHandler instance)

    // Handle MongoDB Duplicate Key Error (code 11000)
    if(err.code === 11000){
        const message = `Duplicate field value entered`;
        err = new ErrorHandler(message, 400);
    }

    // Handle Mongoose CastError (e.g., bad ObjectId)
    if (err.name === "CastError") {
        const message = `Resource not found. Invalid ${err.path}`;
        err = new ErrorHandler(message, 400);
    }
    
    // Handle JWT Errors
    if(err.name === "JsonWebTokenError"){
        const message = "JSON Web Token is invalid, try again";
        err = new ErrorHandler(message, 401); // 401 is better for authentication issues
    }

    if(err.name === "TokenExpiredError"){
        const message = "JSON Web Token has expired, try again";
        err = new ErrorHandler(message, 401); // 401 is better for authentication issues
    }

    // 3. Extract final error message
    // Handles Mongoose Validation Errors (e.g., required field missing)
    const errorMessage = err.errors
        ? Object.values(err.errors)
            .map((error) => error.message)
            .join(" ")
        : err.message; // Uses the message set by the handlers above

    
    return res.status(err.statusCode).json({
        success: false,
        message: errorMessage,
    });
};

export default ErrorHandler;