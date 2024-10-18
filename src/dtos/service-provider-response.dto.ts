import { Exclude, Expose } from 'class-transformer';

export class ServiceProvidersResponseDTO {
  @Expose()
  id!: string;

  @Expose()
  fullName!: string;

  @Expose()
  birthDate!: Date;

  @Exclude()
  cpf!: string;

  @Exclude()
  address!: string;

  @Exclude()
  photo?: string;
}
