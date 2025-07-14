import { Router } from 'express';
import { AuctionController } from '../controllers/auction.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.post('/', authenticate, AuctionController.createAuction);
router.get('/', authenticate, AuctionController.getAuctions);
router.get('/:id', authenticate, AuctionController.getAuctionById);
router.put('/:id', authenticate, AuctionController.updateAuction);
router.delete('/:id', authenticate, AuctionController.deleteAuction);

export default router;
