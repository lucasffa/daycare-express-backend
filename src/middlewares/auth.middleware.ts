// src/middlewares/auth.middleware.ts

import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { UserRole } from '../enums/roles.enum';
import { Config } from '../configs/environment.config';

interface TokenPayload extends JwtPayload {
    id: string;
    role: UserRole;
}
export interface AuthRequest extends Request {
    user: TokenPayload;
}

export function authenticateToken(req: AuthRequest, res: Response, next: NextFunction): void {
    const authHeader = req.get('authorization');

    if (!authHeader) {
        res.status(401).json({ message: 'Cabeçalho de autorização ausente' });
        return;
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        res.status(401).json({ message: 'Token ausente no cabeçalho de autorização' });
        return;
    }

    jwt.verify(token, Config.getJwtSecret() as string, (err, decoded) => {
        if (err) {
            res.status(403).json({ message: 'Token inválido ou expirado' });
            return;
        }

        if (decoded && typeof decoded === 'object' && 'id' in decoded && 'role' in decoded) {
            req.user = decoded as TokenPayload;
            next();
        } else {
            res.status(403).json({ message: 'Payload do token inválido' });
        }
    });
}