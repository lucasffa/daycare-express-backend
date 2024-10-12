// src/dtos/CreateParentDTO.ts
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateParentDTO {
  @IsString()
  @IsNotEmpty()
  fullName!: string;

  @IsString()
  @IsNotEmpty()
  cpf!: string;

  @IsString()
  @IsNotEmpty()
  rg!: string;

  @IsString()
  @IsNotEmpty()
  address!: string;

  @IsString()
  @IsNotEmpty()
  primaryPhone!: string;

  @IsString()
  @IsOptional()
  secondaryPhone?: string;

  @IsString()
  @IsNotEmpty()
  profession!: string;

  @IsString()
  @IsNotEmpty()
  workplace!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @IsOptional()
  photo?: string;
}