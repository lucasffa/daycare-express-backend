// src/dtos/cpf-search.dto.ts
import { IsNotEmpty, Matches } from 'class-validator';

export class CpfSearchDTO {
    @IsNotEmpty()
    @Matches(/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/, {
        message: 'CPF must be in the format XXX.XXX.XXX-XX',
    })
    cpf!: string;
}