// src/dtos/create-user.dto.ts
import { IsEmail, IsEmpty, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { UserRole } from '../enums/roles.enum';

export class CreateUserDTO {
    @IsString()
    @IsNotEmpty()
    username!: string;

    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsEmail()
    email!: string;

    @IsString()
    @MinLength(6)
    password!: string;

    @IsEnum(UserRole)
    @IsEmpty()
    @IsOptional()
    role!: UserRole;
}