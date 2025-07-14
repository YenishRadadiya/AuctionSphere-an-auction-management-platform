// src/routes/product.routes.ts
import { Router } from 'express';
import upload from '../middlewares/imageupload';
import { ProductController } from '../controllers/product.controller';

const router = Router();

// ✅ Specific routes first
router.get('/category', ProductController.getCategories);
router.post('/add', upload.single('image'), ProductController.createProduct);
router.put('/:id', upload.single('image'), ProductController.updateProduct);
router.delete('/:id', ProductController.deleteProduct);
router.patch('/:id/toggle-status', ProductController.toggleProductStatus);

// ✅ Then the generic routes
router.get('/:id', ProductController.getProducts);      // must come after /category
router.get('/', ProductController.getProducts);

export default router;
