// src/dtos/CreateAccountantDTO.ts
import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { IsCpfValid } from "../validators/cpf.validator";

export class CreateAccountantDTO {
  @IsString()
  @IsNotEmpty()
  fullName!: string;

  @IsString()
  @IsNotEmpty()
  crc!: string;

  @IsString()
  @IsNotEmpty()
  @IsCpfValid()
  cpf!: string;

  @IsString()
  @IsNotEmpty()
  rg!: string;

  @IsString()
  @IsNotEmpty()
  primaryPhone!: string;

  @IsString()
  @IsOptional()
  secondaryPhone?: string;

  @IsEmail()
  email!: string;
}
