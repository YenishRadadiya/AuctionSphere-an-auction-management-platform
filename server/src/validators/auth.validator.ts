import { z } from 'zod';

// Schema definitions
export const registerSchema = z.object({
    username: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters')
});

export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters')
});

export const forgotPasswordSchema = z.object({
    email: z.string().email('Invalid email address')
});

export const resetPasswordSchema = z.object({
    encodedData: z.string(),
    password: z.string().min(8, 'Password must be at least 8 characters')
});

// Type definitions
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;