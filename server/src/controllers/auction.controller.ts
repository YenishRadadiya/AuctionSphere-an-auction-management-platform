import { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { PrismaClient, AuctionStatus } from '@prisma/client';
import { createAuctionSchema, updateAuctionSchema } from '../validators/auction.validators';

const prisma = new PrismaClient();

export class AuctionController {
    // Create Auction
    static createAuction = expressAsyncHandler(async (req: Request, res: Response): Promise<void> => {
        const validation = createAuctionSchema.safeParse(req.body);
        if (!validation.success) {
            res.status(400).json({ message: 'Validation failed', errors: validation.error.flatten().fieldErrors });
            return;
        }

        const data = validation.data;
        const seller_id = req.user?.userId;

        if (!seller_id) {
            res.status(401).json({ message: 'Unauthorized: Missing user ID' });
            return;
        }

        const auction = await prisma.auction.create({
            data: {
                ...data,
                publish_time: new Date(data.publish_time),
                start_time: new Date(data.start_time),
                end_time: new Date(data.end_time),
                seller_id,
                status: AuctionStatus.PENDING,
                approved_by: null // Optional now
            }
        });

        res.status(201).json({ message: 'Auction created successfully', auction });
    });

    // Get All Auctions
    static getAuctions = expressAsyncHandler(async (_req: Request, res: Response): Promise<void> => {
        const auctions = await prisma.auction.findMany({
            include: {
                product: true,
                seller: true,
                approver: true
            },
            orderBy: {
                created_at: 'desc'
            }
        });

        res.status(200).json({ auctions });
    });

    // Get Auction by ID
    static getAuctionById = expressAsyncHandler(async (req: Request, res: Response): Promise<void> => {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ message: 'Invalid auction ID' });
            return;
        }

        const auction = await prisma.auction.findUnique({
            where: { id },
            include: {
                product: true,
                seller: true,
                approver: true
            }
        });

        if (!auction) {
            res.status(404).json({ message: 'Auction not found' });
            return;
        }

        res.status(200).json({ auction });
    });

    // Update Auction
    static updateAuction = expressAsyncHandler(async (req: Request, res: Response): Promise<void> => {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ message: 'Invalid auction ID' });
            return;
        }

        const validation = updateAuctionSchema.safeParse(req.body);
        if (!validation.success) {
            res.status(400).json({ message: 'Validation failed', errors: validation.error.flatten().fieldErrors });
            return;
        }

        const existing = await prisma.auction.findUnique({ where: { id } });
        if (!existing) {
            res.status(404).json({ message: 'Auction not found' });
            return;
        }

        const updated = await prisma.auction.update({
            where: { id },
            data: {
                ...(validation.data.title !== undefined && { title: validation.data.title }),
                ...(validation.data.description !== undefined && { description: validation.data.description }),
                ...(validation.data.product_id !== undefined && { product_id: validation.data.product_id }),
                ...(validation.data.base_price !== undefined && { base_price: validation.data.base_price }),
                ...(validation.data.increment_percentage !== undefined && { increment_percentage: validation.data.increment_percentage }),
                ...(validation.data.publish_time !== undefined && { publish_time: new Date(validation.data.publish_time) }),
                ...(validation.data.start_time !== undefined && { start_time: new Date(validation.data.start_time) }),
                ...(validation.data.end_time !== undefined && { end_time: new Date(validation.data.end_time) }),
                ...(validation.data.extend_duration !== undefined && { extend_duration: validation.data.extend_duration }),
                ...(validation.data.auto_extend_threshold !== undefined && { auto_extend_threshold: validation.data.auto_extend_threshold }),
                ...(validation.data.status !== undefined && { status: validation.data.status as AuctionStatus })
            }
        });

        res.status(200).json({ message: 'Auction updated successfully', auction: updated });
    });

    // Delete Auction
    static deleteAuction = expressAsyncHandler(async (req: Request, res: Response): Promise<void> => {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ message: 'Invalid auction ID' });
            return;
        }

        const existing = await prisma.auction.findUnique({ where: { id } });
        if (!existing) {
            res.status(404).json({ message: 'Auction not found' });
            return;
        }

        await prisma.auction.delete({ where: { id } });
        res.status(200).json({ message: 'Auction deleted successfully' });
    });
}
