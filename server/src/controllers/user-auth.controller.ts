// src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { PrismaClient } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { RegisterInput, LoginInput } from '../validators/auth.validator';
import { AppError } from '../utils/AppError';
import * as argon2 from "argon2";


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

    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(password, salt);
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

    // const isPasswordValid = await bcrypt.compare(password, user.password);
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