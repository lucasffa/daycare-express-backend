// src/dtos/parent-child-relations-response.dto.ts
import { Expose } from "class-transformer";
import { ParentResponseDTO } from "./parent-response.dto";
import { ChildResponseDTO } from "./child-response.dto";

export class ParentChildRelationsResponseDTO {
    @Expose()
    parent!: ParentResponseDTO;

    @Expose()
    child!: ChildResponseDTO;

    @Expose()
    guardianshipType!: string;

    @Expose()
    kinshipDegree!: string;

    @Expose()
    additionalInfo?: string;

    @Expose()
    isAuthorizedToPickup!: boolean;
}