// src/middlewares/upload.ts
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.config';

const storage = new CloudinaryStorage({
    cloudinary,
    params: async () => ({
        folder: 'auctionsphere/products',
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'], // single format (choose most preferred), or handle validation elsewhere
        // public_id: (req: any, file: any) => `${Date.now()}-${file.originalname}`,
    }),
});

const upload = multer({ storage });

export default upload;
