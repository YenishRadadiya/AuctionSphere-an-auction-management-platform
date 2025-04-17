// src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { PrismaClient } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { RegisterInput, LoginInput } from '../validators/auth.validator';
import { AppError } from '../utils/AppError';
import * as argon2 from "argon2";
import cryptoRandomString from 'crypto-random-string';
import { sendEmail } from '../services/email';


const prisma = new PrismaClient();

export const register = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { username, email, password }: RegisterInput = req.body;

    const existingUser = await prisma.users.findFirst({
        where: {
            OR: [
                { email },
                { username }
            ]
        }
    });

    if (existingUser) {
        throw new AppError('Email or Username already exists', StatusCodes.CONFLICT);
    }

    const hashedPassword = await argon2.hash(password, {
        type: argon2.argon2id,
    });

    const user = await prisma.users.create({
        data: {
            username,
            email,
            password: hashedPassword
        }
    });

    res.status(StatusCodes.CREATED).json({
        status: 'success',
        message: 'Registration successful',
        data: {
            username,
            email
        }
    });
});

export const login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { email, password }: LoginInput = req.body;

    const user = await prisma.users.findUnique({
        where: { email }
    });

    if (!user) {
        throw new AppError('Invalid credentials', StatusCodes.UNAUTHORIZED);
    }

    const isPasswordValid = await argon2.verify(user.password, password);

    if (!isPasswordValid) {
        throw new AppError('Invalid credentials', StatusCodes.UNAUTHORIZED);
    }

    const token: string = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET as string,
        { expiresIn: process.env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] }
    );

    res.status(StatusCodes.OK).json({
        status: 'success',
        message: 'Login successful',
        data: {
            token,
            user: {
                id: user.id,
                name: user.username,
                email: user.email,
            }
        }
    });
});


export const forgotPassword = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;

    const user = await prisma.users.findUnique({
        where: { email }
    });

    if (!user) {
        throw new AppError('User not exit with provided email address', StatusCodes.UNAUTHORIZED);
    }

    const authorizationToken = cryptoRandomString({ length: 10, type: 'alphanumeric' });
    const hashedToken: string = await argon2.hash(authorizationToken, {
        type: argon2.argon2id,
    });

    await prisma.users.update({
        where: { email },
        data: {
            resetToken: hashedToken,
            token_expiresIn: new Date(Date.now() + 10 * 60 * 1000)
        }
    })
    await sendEmail(email, authorizationToken);

    res.status(StatusCodes.OK).json({
        status: 'success',
        message: 'Token sent successfully',

    });
});


export const resetPassword = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { encodedData, password } = req.body;

    try {
        // Decode the base64 string
        const decodedString = Buffer.from(encodedData, 'base64').toString();
        // Parse the query string
        const params = new URLSearchParams(decodedString);
        const email = params.get('email');
        const token = params.get('token');

        if (!email || !token) {
            throw new AppError('Invalid reset data', StatusCodes.BAD_REQUEST);
        }

        // Find user by email
        const user = await prisma.users.findUnique({
            where: { email }
        });

        if (!user || !user.resetToken || !user.token_expiresIn) {
            throw new AppError('Invalid token or user not found', StatusCodes.BAD_REQUEST);
        }

        // Check if token has expired
        if (user.token_expiresIn < new Date()) {
            throw new AppError('Token has expired', StatusCodes.BAD_REQUEST);
        }

        // Verify token
        const isValidToken = await argon2.verify(user.resetToken, token);
        if (!isValidToken) {
            throw new AppError('Invalid token', StatusCodes.BAD_REQUEST);
        }

        // Hash the new password
        const hashedPassword = await argon2.hash(password, {
            type: argon2.argon2id,
        });

        // Update user with new password and clear reset token data
        await prisma.users.update({
            where: { email },
            data: {
                password: hashedPassword,
                resetToken: null,
                token_expiresIn: null
            }
        });

        res.status(StatusCodes.OK).json({
            status: 'success',
            message: 'Password reset successfully',
        });
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError('Invalid reset data', StatusCodes.BAD_REQUEST);
    }
});