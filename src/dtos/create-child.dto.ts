import { IsNotEmpty, IsString, IsOptional } from "class-validator";
import { Type } from "class-transformer";

export class CreateChildDTO {
  @IsNotEmpty()
  fullName!: string;

  @IsNotEmpty()
  @Type(() => Date)
  birthDate!: Date;

  private _cpf!: string;

  @IsString()
  @IsNotEmpty()
  cpf!: string;

  @IsString()
  @IsNotEmpty()
  address!: string;

  @IsString()
  @IsNotEmpty()
  medicalInfo!: string;

  @IsString()
  @IsOptional()
  photo?: string;
}
