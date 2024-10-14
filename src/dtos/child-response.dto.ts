import { Exclude, Expose } from "class-transformer";

export class ChildResponseDTO {
    @Exclude()
    id!: string;

    @Expose()
    fullName!: string;

    @Expose()
    birthDate!: Date;

    @Exclude()
    cpf!: string;

    @Exclude()
    address!: string;

    @Expose()
    medicalInfo!: string;

    @Exclude()
    photo?: string;

    @Exclude()
    imageUsePermission!: boolean;
}