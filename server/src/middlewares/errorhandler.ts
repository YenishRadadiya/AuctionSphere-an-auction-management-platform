import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

interface AppError extends Error {
    statusCode?: number;
    errorMessage?: string;
    data?: string;

}

export const errorHandler = (
    err: AppError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;

    res.status(statusCode).json({
        status: 'error',
        message: err.message || 'Internal Server Error',
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
};