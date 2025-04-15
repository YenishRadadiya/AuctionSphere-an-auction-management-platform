import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { RegisterInput, LoginInput } from '../validators/auth.validator';

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, email, password }: RegisterInput = req.body;

        const existingUser = await prisma.users.findFirst({
            where: {
                OR: [
                    { email: email },
                    { username: email }
                ]
            }
        });
        if (existingUser) {
            res.status(StatusCodes.CONFLICT).json({
                status: 'error',
                message: 'Email or Username already exists'
            });
        }
        else {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const user = await prisma.users.create({
                data: {
                    username: username,
                    email,
                    password: hashedPassword
                }
            });

            res.status(StatusCodes.CREATED).json({
                status: 'success',
                message: 'Registration successful',
                data: {
                    username, email
                }
            });
        }
    } catch (error) {
        console.error('Registration error:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: 'Failed to register user'
        });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password }: LoginInput = req.body;

        const user = await prisma.users.findUnique({
            where: { email }
        });

        if (!user) {
            res.status(StatusCodes.UNAUTHORIZED).json({
                status: 'error',
                message: 'Invalid credentials'
            });
        }
        else {
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                res.status(StatusCodes.UNAUTHORIZED).json({
                    status: 'error',
                    message: 'Invalid credentials'
                });
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
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: 'Failed to authenticate user'
        });
    }
};