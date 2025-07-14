import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';

interface AuthPayload {
    id: number;
    email: string;
    role?: string;
}

export const authenticate: RequestHandler = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

        req.user = {
            id: decoded.userId ?? decoded.id, // Accept either userId or id
            email: decoded.email,
            role: decoded.role
        };

        if (!req.user.id) {
            return res.status(401).json({ message: 'Unauthorized: User ID missing in token' });
        }

        next();
    } catch (err) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
};
