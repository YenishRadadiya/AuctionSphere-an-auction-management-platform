import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { StatusCodes } from 'http-status-codes';

export const validateRequest = (schema: AnyZodObject) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            await schema.parseAsync(req.body);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                res.status(StatusCodes.BAD_REQUEST).json({
                    status: 'error',
                    message: 'Validation failed',
                    errors: error.errors,
                });
            }

            next(error);
        }
    };
};
