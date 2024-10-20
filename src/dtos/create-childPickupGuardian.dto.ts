import { IsNotEmpty, IsString, IsUUID } from "class-validator";

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

  @IsUUID()
  @IsNotEmpty()
  childId!: string;
}