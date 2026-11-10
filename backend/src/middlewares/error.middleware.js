import { ApiError } from "../utils/ApiError.js";

export const errorHandler = (err, req, res, next) => {
    // Mongoose-specific errors won't be ApiError instances — normalize them first
    if (err.name === "CastError") {
        err = new ApiError(400, "Invalid id");
    }
    if (err.name === "ValidationError") {
        err = new ApiError(400, err.message);
    }

    const statusCode = err.statusCode || 500;

    return res.status(statusCode).json({
        success: err.success ?? false,
        message: err.message || "Internal server error",
        errors: err.errors || [],
        data: err.data ?? null,
    });
};