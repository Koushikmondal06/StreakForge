import { Request, Response, NextFunction } from 'express';

export interface AuthRequest extends Request {
    token?: string;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'No token provided' });
        return;
    }

    const token = authHeader.split(' ')[1];

    if (!token || token.trim().length === 0) {
        res.status(401).json({ error: 'Invalid token format' });
        return;
    }

    req.token = token;
    next();
};
