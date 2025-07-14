// import { PrismaClient } from "@prisma/client";
// import expressAsyncHandler from "express-async-handler";
// import { Request, Response } from "express";


// const prisma = new PrismaClient();



// export class ProductController {

//     static getCategories = expressAsyncHandler(
//         async (req: Request, res: Response): Promise<void> => {
//             const { parent_id } = req.query;

//             const categories = await prisma.category.findMany({
//                 where: {
//                     parent_id: parent_id === undefined ? null : Number(parent_id),
//                     is_active: true,
//                 },
//                 orderBy: {
//                     name: 'asc',
//                 },
//             });

//             if (categories.length) {
//                 res.status(200).json(categories);
//             }
//             else {
//                 res.status(404).json({ message: "Category or Sub-category not found" })
//             }
//         }
//     );

//     static createProduct = expressAsyncHandler(async (req: Request, res: Response): Promise<void> => {
//         const { title, description, category_id } = req.body;
//         const seller_id = 34;

//         if (!req.file?.path) {
//             res.status(400).json({ message: 'Product image is required.' });
//         }

//         const newProduct = await prisma.product.create({
//             data: {
//                 title,
//                 description,
//                 category_id: parseInt(category_id),
//                 seller_id: Number(seller_id),
//                 main_image_url: req.file?.path,
//                 status: 'draft',
//             },
//         });

//         res.status(201).json({ message: 'Product added', product: newProduct });
//     });


// }


import { PrismaClient } from "@prisma/client";
import expressAsyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { v2 as cloudinary } from 'cloudinary';

import {
    createProductSchema,
    updateProductSchema,
    productQuerySchema,
} from "../validators/product.validator";

const prisma = new PrismaClient();

export class ProductController {

    static getCategories = expressAsyncHandler(async (req: Request, res: Response): Promise<void> => {
        const { parent_id } = req.query;

        const categories = await prisma.category.findMany({
            where: {
                parent_id: parent_id === undefined ? null : Number(parent_id),
                is_active: true,
            },
            orderBy: {
                name: 'asc',
            },
        });

        if (categories.length) {
            res.status(200).json(categories);
        } else {
            res.status(404).json({ message: "Category or Sub-category not found" });
        }
    });

    // CREATE PRODUCT
    static createProduct = expressAsyncHandler(async (req: Request, res: Response): Promise<void> => {
        const parsed = createProductSchema.safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json({ message: "Validation failed", errors: parsed.error.flatten().fieldErrors });
            return;
        }

        const { title, description, category_id } = parsed.data;
        // const seller_id = req.user?.id; // Replace with auth-based seller_id
        const seller_id = req.user?.id;
        if (!seller_id) {
            res.status(401).json({ message: 'Unauthorized: Seller ID missing' });
            return;
        }


        if (!req.file?.path) {
            res.status(400).json({ message: 'Product image is required.' });
            return;
        }

        const categoryExists = await prisma.category.findFirst({
            where: { id: parseInt(category_id), is_active: true },
        });

        if (!categoryExists) {
            res.status(400).json({ message: 'Invalid category selected.' });
            return;
        }

        const newProduct = await prisma.product.create({
            data: {
                title,
                description,
                category_id: parseInt(category_id),
                seller_id,
                main_image_url: req.file.path,
                status: 'draft',
            },
        });

        res.status(201).json({ message: 'Product created successfully', product: newProduct });
    });



    // GET PRODUCTS
    static getProducts = expressAsyncHandler(async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;

        if (id) {
            const product = await prisma.product.findUnique({
                where: { id: parseInt(id) },
                include: {
                    category: { select: { id: true, name: true, parent_id: true } },
                    seller: { select: { id: true, username: true, email: true } },
                },
            });

            if (!product) {
                res.status(404).json({ message: 'Product not found' });
                return;
            }

            res.status(200).json({ product });
            return;
        }

        const parsed = productQuerySchema.safeParse(req.query);
        if (!parsed.success) {
            res.status(400).json({ message: 'Invalid query params', errors: parsed.error.flatten().fieldErrors });
            return;
        }

        const { page = '1', limit = '10', category_id, status, seller_id, search } = parsed.data;

        const whereCondition: any = {};
        if (category_id) whereCondition.category_id = parseInt(category_id);
        if (status) whereCondition.status = status;
        if (seller_id) whereCondition.seller_id = parseInt(seller_id);
        if (search) {
            whereCondition.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const take = parseInt(limit);

        const totalProducts = await prisma.product.count({ where: whereCondition });
        const products = await prisma.product.findMany({
            where: whereCondition,
            include: {
                category: { select: { id: true, name: true } },
                seller: { select: { id: true, username: true, email: true } },
            },
            orderBy: { created_at: 'desc' },
            skip,
            take,
        });

        const totalPages = Math.ceil(totalProducts / take);

        res.status(200).json({
            products,
            pagination: {
                current_page: parseInt(page),
                total_pages: totalPages,
                total_products: totalProducts,
                has_next: parseInt(page) < totalPages,
                has_prev: parseInt(page) > 1,
            },
        });
    });

    // UPDATE PRODUCT
    static updateProduct = expressAsyncHandler(async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({ message: 'Product ID is required.' });
            return;
        }

        const parsed = updateProductSchema.safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json({ message: 'Validation failed', errors: parsed.error.flatten().fieldErrors });
            return;
        }

        const { title, description, category_id, status } = parsed.data;

        const existingProduct = await prisma.product.findUnique({
            where: { id: parseInt(id) },
        });

        if (!existingProduct) {
            res.status(404).json({ message: 'Product not found.' });
            return;
        }

        if (category_id) {
            const categoryExists = await prisma.category.findFirst({
                where: { id: parseInt(category_id), is_active: true },
            });
            if (!categoryExists) {
                res.status(400).json({ message: 'Invalid category selected.' });
                return;
            }
        }

        const updateData: any = {};
        if (title) updateData.title = title;
        if (description) updateData.description = description;
        if (category_id) updateData.category_id = parseInt(category_id);
        if (status) updateData.status = status;

        if (req.file?.path) {
            if (existingProduct.main_image_url) {
                try {
                    const publicId = existingProduct.main_image_url.split('/').pop()?.split('.')[0];
                    if (publicId) {
                        await cloudinary.uploader.destroy(publicId);
                    }
                } catch (err) {
                    console.error('Error deleting old image:', err);
                }
            }
            updateData.main_image_url = req.file.path;
        }

        const updatedProduct = await prisma.product.update({
            where: { id: parseInt(id) },
            data: updateData,
            include: {
                category: { select: { id: true, name: true } },
            },
        });

        res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
    });

    // DELETE PRODUCT
    static deleteProduct = expressAsyncHandler(async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;

        if (!id) {
            res.status(400).json({ message: 'Product ID is required.' });
            return;
        }

        const existingProduct = await prisma.product.findUnique({
            where: { id: parseInt(id) },
        });

        if (!existingProduct) {
            res.status(404).json({ message: 'Product not found.' });
            return;
        }

        if (existingProduct.main_image_url) {
            try {
                const publicId = existingProduct.main_image_url.split('/').pop()?.split('.')[0];
                if (publicId) {
                    await cloudinary.uploader.destroy(publicId);
                }
            } catch (err) {
                console.error('Error deleting image from cloudinary:', err);
            }
        }

        await prisma.product.delete({
            where: { id: parseInt(id) },
        });

        res.status(200).json({ message: 'Product deleted successfully' });
    });

    // TOGGLE PRODUCT STATUS
    static toggleProductStatus = expressAsyncHandler(async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;

        if (!id) {
            res.status(400).json({ message: 'Product ID is required.' });
            return;
        }

        const product = await prisma.product.findUnique({
            where: { id: parseInt(id) },
        });

        if (!product) {
            res.status(404).json({ message: 'Product not found.' });
            return;
        }

        const newStatus = product.status === 'active' ? 'inactive' : 'active';

        const updatedProduct = await prisma.product.update({
            where: { id: parseInt(id) },
            data: { status: newStatus },
        });

        res.status(200).json({
            message: `Product ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`,
            product: updatedProduct,
        });
    });
}
