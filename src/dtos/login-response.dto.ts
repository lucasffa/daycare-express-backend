// src/dtos/login-response.dto.ts
import { Exclude, Expose } from 'class-transformer';

export class LoginResponseDTO {
    @Expose()
    id!: string;

    @Expose()
    username!: string;

    @Expose()
    name!: string;

    @Expose()
    lastLoginAt!: Date | null;

    @Expose()
    token!: string;

    @Exclude()
    password!: string;

    @Exclude()
    isDeleted!: boolean;

    @Exclude()
    isActive!: boolean;
}