// src/middlewares/ensure-role.middleware.ts
import { Response, NextFunction, Request } from 'express';
import { UserRole } from '../enums/roles.enum';
import { AuthRequest } from '../interfaces/auth-request.interface';

export function ensureRole(roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const authRequest = req as unknown as AuthRequest;

    const userRole = authRequest.user?.role;

    if (!userRole) {
      res.status(403).json({ message: 'Acesso negado. Nenhum papel de usuário encontrado.' });
      return;
    }

    if (roles.includes(userRole)) {
      return next();
    }

    res.status(403).json({ message: 'Acesso negado.' });
  };
}