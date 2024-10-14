// src/middlewares/ensure-role.middleware.ts
import { Response, NextFunction, Request } from 'express';
import { UserRole } from '../enums/roles.enum';
import { AuthRequest } from '../interfaces/auth-request.interface';
import jwt from 'jsonwebtoken';
import { Config } from '../configs/environment.config';

export function ensureRole(roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: 'Acesso negado. Token ausente ou malformado.' });
      return;
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, Config.getJwtSecret()) as AuthRequest['user'];

      const userRole = decoded?.role;

      if (!userRole || !roles.includes(userRole)) {
        res.status(403).json({ message: 'Acesso negado. Papel de usuário insuficiente.' });
        return;
      }

      (req as unknown as AuthRequest).user = decoded;

      next();
    } catch (error) {
      res.status(403).json({ message: 'Acesso negado. Token inválido ou expirado.' });
      return;
    }
  };
}