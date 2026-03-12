import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
    user?: { id: string; role: string };
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Acesso negado. Token não fornecido.' });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
        console.error('[CRITICAL] JWT_SECRET is not defined in environment variables');
        return res.status(500).json({ error: 'Erro interno de configuração de segurança.' });
    }

    jwt.verify(token, secret, (err, user) => {
        if (err) return res.status(403).json({ error: 'Token inválido' });
        req.user = user as { id: string; role: string };
        next();
    });
};

export const requireRole = (role: 'company' | 'candidate') => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user || req.user.role !== role) {
            return res.status(403).json({ error: `Acesso negado. Requer papel: ${role}` });
        }
        next();
    };
};
