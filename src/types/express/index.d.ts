// src/types/express/index.d.ts
import { UserRole } from '../../enums/roles.enum';

declare global {
    namespace Express {
        interface Request {
            user: {
                id: string;
                role: UserRole;
            };
        }
    }
}