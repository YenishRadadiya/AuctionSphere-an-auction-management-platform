// src/middleware/error.middleware.ts
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AppError } from '../utils/AppError';

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    // Check if error is an instance of our AppError
    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            status: 'error',
            message: err.message,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    }

    // Handle other specific error types
    if (err.name === 'ValidationError') {
        res.status(StatusCodes.BAD_REQUEST).json({
            status: 'error',
            message: err.message,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    }

    if (err.name === 'JsonWebTokenError') {
        res.status(StatusCodes.UNAUTHORIZED).json({
            status: 'error',
            message: 'Invalid token. Please log in again.',
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    }

    if (err.name === 'TokenExpiredError') {
        res.status(StatusCodes.UNAUTHORIZED).json({
            status: 'error',
            message: 'Your token has expired. Please log in again.',
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    }

    // Default error response for unhandled errors
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: err.message || 'Internal Server Error',
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
};