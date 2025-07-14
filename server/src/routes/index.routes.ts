import { Router } from 'express';
import authRoutes from './user.routes';
import productRoutes from './product.routes';
const router = Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/product', productRoutes);


export default router;