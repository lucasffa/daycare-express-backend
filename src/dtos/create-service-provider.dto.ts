import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateServiceProviderDTO {
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
  rg!: string;

  @IsString()
  @IsNotEmpty()
  address!: string;

  @IsString()
  @IsNotEmpty()
  phone!: string;

  @IsString()
  @IsOptional()
  photo?: string;

  @IsString()
  @IsOptional()
  archiveCurriculum?: string;

  @IsNotEmpty()
  @Type(() => Date)
  dateOfHire!: Date;

  @IsString()
  @IsNotEmpty()
  jobTitle!: string;

  @IsString()
  @IsNotEmpty()
  numberCpts!: string;

  @IsString()
  @IsNotEmpty()
  previousWorkExperience!: string;

  @IsString()
  @IsOptional()
  certifications?: string;

  @IsString()
  @IsOptional()
  coursesCompleted?: string;
}
