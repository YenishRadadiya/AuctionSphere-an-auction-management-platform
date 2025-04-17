// src/middleware/error.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AppError } from '../utils/AppError';

interface ErrorResponse {
    status: string;
    message: string;
    stack?: string;
}

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
): void => {

    let statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    let message = 'Internal Server Error';


    const errorResponse: ErrorResponse = {
        status: 'error',
        message: err.message || message
    };

    if (process.env.NODE_ENV === 'development') {
        errorResponse.stack = err.stack;
    }

    if (err instanceof AppError) {
        statusCode = err.statusCode;
    }
    else {
        switch (err.name) {
            case 'ValidationError':
                statusCode = StatusCodes.BAD_REQUEST;
                break;

            case 'JsonWebTokenError':
                statusCode = StatusCodes.UNAUTHORIZED;
                errorResponse.message = 'Invalid token. Please log in again.';
                break;

            case 'TokenExpiredError':
                statusCode = StatusCodes.UNAUTHORIZED;
                errorResponse.message = 'Your token has expired. Please log in again.';
                break;
        }
    }
    res.status(statusCode).json(errorResponse);
};