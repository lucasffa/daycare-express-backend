import { IsNotEmpty, IsString, IsOptional } from "class-validator";
import { Type } from "class-transformer";

export class CreateChildDTO {
  @IsNotEmpty()
  fullName!: string;

  @IsNotEmpty()
  @Type(() => Date)
  birthDate!: Date;

  private _cpf!: string;

  @IsString()
  @IsNotEmpty()
  set cpf(value: string) {
    // Formatando o CPF para o formato XXX.XXX.XXX-XX
    const formattedCpf = value.replace(
      /(\d{3})(\d{3})(\d{3})(\d{2})/,
      "$1.$2.$3-$4"
    );
    this._cpf = formattedCpf;
  }

  get cpf(): string {
    return this._cpf;
  }

  @IsString()
  @IsNotEmpty()
  address!: string;

  @IsString()
  @IsNotEmpty()
  medicalInfo!: string;

  @IsString()
  @IsOptional()
  photo?: string;
}
