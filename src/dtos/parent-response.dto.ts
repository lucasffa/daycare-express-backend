// src/dtos/parent-response.dto.ts
import { Expose, Exclude } from "class-transformer";

export class ParentResponseDTO {
    @Expose()
    id!: string;

    @Expose()
    fullName!: string;

    @Expose()
    primaryPhone!: string;

    @Exclude()
    cpf!: string;

    @Exclude()
    rg!: string;

    @Exclude()
    address!: string;

    @Exclude()
    secondaryPhone?: string;

    @Expose()
    profession!: string;

    @Expose()
    workplace!: string;

    @Exclude()
    email!: string;

    @Exclude()
    photo?: string;
}