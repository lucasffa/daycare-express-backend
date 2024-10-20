import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class ChildPickupGuardianDTO {
  @IsString()
  @IsNotEmpty()
  fullName!: string;

  @IsNotEmpty()
  @IsString()
  cpf!: string;

  @IsString()
  @IsNotEmpty()
  rg!: string;

  @IsString()
  @IsNotEmpty()
  phone!: string;

  @IsString()
  @IsNotEmpty()
  relationship!: string;

  @IsString()
  @IsNotEmpty()
  identificationDocument!: string;

  @IsNotEmpty()
  childId!: string;

  @IsNotEmpty()
  @IsBoolean()
  financialResponsible!: boolean;
}