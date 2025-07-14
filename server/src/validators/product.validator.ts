// src/validators/product.validator.ts
import { z } from 'zod';

// Create Product
export const createProductSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    category_id: z.string().regex(/^\d+$/, 'Category ID must be a number'),
});

// Update Product
export const updateProductSchema = z.object({
    title: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    category_id: z.string().regex(/^\d+$/, 'Category ID must be a number').optional(),
    status: z.enum(['draft', 'active', 'inactive']).optional(),
});

// Query Params for Filtering
export const productQuerySchema = z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    category_id: z.string().regex(/^\d+$/).optional(),
    status: z.enum(['draft', 'active', 'inactive']).optional(),
    seller_id: z.string().regex(/^\d+$/).optional(),
    search: z.string().optional(),
});

// Types
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductQueryInput = z.infer<typeof productQuerySchema>;
