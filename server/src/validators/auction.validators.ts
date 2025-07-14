import { z } from 'zod';

export const createAuctionSchema = z.object({
    title: z.string().min(3),
    description: z.string().optional(),
    product_id: z.number(),
    base_price: z.number(),
    increment_percentage: z.number().min(0.1),
    publish_time: z.string().refine((v) => !isNaN(Date.parse(v)), {
        message: "Invalid publish_time format"
    }),
    start_time: z.string().refine((v) => !isNaN(Date.parse(v)), {
        message: "Invalid start_time format"
    }),
    end_time: z.string().refine((v) => !isNaN(Date.parse(v)), {
        message: "Invalid end_time format"
    }),
    extend_duration: z.number().optional(),
    auto_extend_threshold: z.number().optional()
});



export const updateAuctionSchema = z.object({
    title: z.string().min(3).optional(),
    description: z.string().optional(),
    product_id: z.number().optional(),
    base_price: z.number().optional(),
    increment_percentage: z.number().min(0.1).optional(),
    publish_time: z.string().refine((v) => !isNaN(Date.parse(v)), {
        message: "Invalid publish_time format"
    }).optional(),
    start_time: z.string().refine((v) => !isNaN(Date.parse(v)), {
        message: "Invalid start_time format"
    }).optional(),
    end_time: z.string().refine((v) => !isNaN(Date.parse(v)), {
        message: "Invalid end_time format"
    }).optional(),
    extend_duration: z.number().optional(),
    auto_extend_threshold: z.number().optional(),
    status: z.enum(['draft', 'active', 'completed', 'cancelled']).optional()
});

