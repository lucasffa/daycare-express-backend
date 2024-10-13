// src/dtos/user-response.dto.ts
import { Expose, Exclude } from 'class-transformer';

export class UserResponseDTO {
    @Expose()
    id!: string;

    @Expose()
    username!: string;

    @Expose()
    email!: string;

    @Expose()
    name!: string;

    @Expose()
    role!: string;

    @Expose()
    createdAt!: Date;

    @Expose()
    lastLoginAt!: Date | null;

    @Expose()
    isActive!: boolean;

    @Exclude()
    password!: string;

    @Exclude()
    isDeleted!: boolean;

    @Exclude()
    deletedAt!: Date | null;
}