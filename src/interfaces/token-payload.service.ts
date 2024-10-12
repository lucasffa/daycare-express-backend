// src/interfaces/token-payload.service.ts
import { JwtPayload } from "jsonwebtoken";
import { UserRole } from "../enums/roles.enum";

export interface TokenPayload extends JwtPayload {
    id: string;
    role: UserRole;
}