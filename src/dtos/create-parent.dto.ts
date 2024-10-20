// src/dtos/CreateParentDTO.ts
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IsCpfValid } from '../validators/cpf.validator';

export class CreateParentDTO {
  @IsString()
  @IsNotEmpty()
  fullName!: string;

  @IsString()
  @IsNotEmpty()
  @IsCpfValid()
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

  @IsOptional()
  financialResponsible?: boolean;
}