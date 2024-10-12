// src/interfaces/auth-request.interface.ts
import { TokenPayload } from "./token-payload.service";

export interface AuthRequest extends Request {
    user: TokenPayload;
}