// src/controllers/auth.controller.ts

import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { PrismaClient } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import * as argon2 from 'argon2';
import cryptoRandomString from 'crypto-random-string';

import { RegisterInput, LoginInput } from '../validators/auth.validator';
import { AppError } from '../utils/AppError';
import { sendEmail } from '../services/email';

const prisma = new PrismaClient();

export class AuthController {
    static register = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const { username, email, password }: RegisterInput = req.body;

        const existingUser = await prisma.users.findFirst({
            where: {
                OR: [{ email }, { username }],
            },
        });

        if (existingUser) {
            res.status(StatusCodes.CONFLICT).json({
                status: 'failed',
                message: 'Username or Email exists',
            });
            return;
        }

        const hashedPassword = await argon2.hash(password, { type: argon2.argon2id });

        await prisma.users.create({
            data: { username, email, password: hashedPassword },
        });
        res.status(StatusCodes.CREATED).json({
            status: 'success',
            message: 'Registration successful',
        });
    });

    static login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const { email, password }: LoginInput = req.body;

        const user = await prisma.users.findUnique({ where: { email } });

        if (!user) {
            res.status(StatusCodes.UNAUTHORIZED).json({
                status: 'failed',
                message: 'User does not exist!',
            });
            return;
        }

        const isPasswordValid = await argon2.verify(user.password, password);
        if (!isPasswordValid) {
            res.status(StatusCodes.UNAUTHORIZED).json({
                status: 'failed',
                message: 'Invalid credentials',
            });
            return;
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email, username: user.username },
            process.env.JWT_SECRET as string,
            { expiresIn: process.env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] }
        );

        res.status(StatusCodes.OK).json({
            status: 'success',
            message: 'Login successful',
            data: { token },
        });
    });

    static forgotPassword = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const { email } = req.body;

        const user = await prisma.users.findUnique({ where: { email } });

        if (!user) {
            res.status(StatusCodes.CONFLICT).json({
                status: 'failed',
                message: 'Email does not exist!',
            });
            return;
        }

        const authorizationToken = cryptoRandomString({ length: 10, type: 'alphanumeric' });
        const hashedToken = await argon2.hash(authorizationToken, { type: argon2.argon2id });

        await prisma.users.update({
            where: { email },
            data: {
                resetToken: hashedToken,
                token_expiresIn: new Date(Date.now() + 10 * 60 * 1000),
            },
        });

        await sendEmail(email, authorizationToken);

        res.status(StatusCodes.OK).json({
            status: 'success',
            message: 'Reset link sent successfully',
        });
    });

    static resetPassword = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const { newPassword, token } = req.body;

        try {
            const decodedString = Buffer.from(token, 'base64').toString();
            const params = new URLSearchParams(decodedString);
            const email = params.get('email');
            const decodedToken = params.get('token');

            if (!email || !decodedToken) {
                res.status(StatusCodes.BAD_REQUEST).json({
                    status: 'failed',
                    message: 'Invalid data',
                });
                return;
            }

            const user = await prisma.users.findUnique({ where: { email } });

            if (!user || !user.resetToken || !user.token_expiresIn) {
                res.status(StatusCodes.BAD_REQUEST).json({
                    status: 'failed',
                    message: 'User not found',
                });
                return;
            }

            if (user.token_expiresIn < new Date()) {
                res.status(StatusCodes.BAD_REQUEST).json({
                    status: 'failed',
                    message: 'Reset link expired',
                });
                return;
            }

            const isValidToken = await argon2.verify(user.resetToken, decodedToken);
            if (!isValidToken) {
                res.status(StatusCodes.BAD_REQUEST).json({
                    status: 'failed',
                    message: 'Invalid link',
                });
                return;
            }

            const hashedPassword = await argon2.hash(newPassword, { type: argon2.argon2id });

            await prisma.users.update({
                where: { email },
                data: {
                    password: hashedPassword,
                    resetToken: null,
                    token_expiresIn: null,
                },
            });

            res.status(StatusCodes.OK).json({
                status: 'success',
                message: 'Password reset successfully',
            });
        } catch (error) {
            throw new AppError('Invalid reset data', StatusCodes.BAD_REQUEST);
        }
    });
}
