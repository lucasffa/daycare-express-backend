import { IsNotEmpty, IsString } from "class-validator";

export class CreateChildPickupGuardianDTO {
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
}