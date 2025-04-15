import { Router } from 'express';
import authRoutes from './user.routes';

const router = Router();

// Mount routes
router.use('/auth', authRoutes);


export default router;