import { Router } from 'express';
import authRoutes from './user.routes';
import productRoutes from './product.routes';
import { authenticate } from '../middlewares/auth.middleware';
import auctionRoutes from './auction.routes';
const router = Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/product', authenticate, productRoutes);
router.use('/auction', authenticate, auctionRoutes);




export default router;