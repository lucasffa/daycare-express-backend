// src/dtos/parent-child-response.dto.ts
import { Expose } from 'class-transformer';
import { GuardianshipType } from '../enums/guardianship-type.enum';

export class ParentChildResponseDTO {
    @Expose()
    parentName!: string;

    @Expose()
    childName!: string;

    @Expose()
    guardianshipType!: GuardianshipType;

    @Expose()
    kinshipDegree!: string;

    @Expose()
    additionalInfo!: string;

    @Expose()
    isAuthorizedToPickup!: boolean;
}