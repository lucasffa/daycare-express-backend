// src/dtos/CreateParentChildDTO.ts
import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { GuardianshipType } from '../enums/guardianship-type.enum';

export class CreateParentChildDTO {
  @IsUUID()
  @IsNotEmpty()
  parentId!: string;

  @IsUUID()
  @IsNotEmpty()
  childId!: string;

  @IsEnum(GuardianshipType)
  guardianshipType!: GuardianshipType;

  @IsString()
  @IsNotEmpty()
  kinshipDegree!: string;

  @IsString()
  @IsOptional()
  additionalInfo?: string;

  @IsBoolean()
  isAuthorizedToPickup!: boolean;
}