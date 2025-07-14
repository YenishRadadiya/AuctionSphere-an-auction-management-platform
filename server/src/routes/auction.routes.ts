// src/routes/auction.routes.ts
import { Router } from 'express';
import { AuctionController } from '../controllers/auction.controller';

const router = Router();

// ❌ REMOVE authenticate from here (already applied in main index)
router.post('/', AuctionController.createAuction);
router.get('/', AuctionController.getAuctions);
// auction.routes.ts

router.get('/user', AuctionController.getAuctionsByUser);
router.get('/active', AuctionController.getActiveAuctions);

router.get('/:id', AuctionController.getAuctionById);
router.put('/:id', AuctionController.updateAuction);
router.delete('/:id', AuctionController.deleteAuction);

export default router;
