// src/dtos/name-search.dto.ts
import { IsNotEmpty, MinLength } from 'class-validator';

export class NameSearchDTO {
    @IsNotEmpty()
    @MinLength(5, { message: 'Name must be at least 5 characters long' })
    parentName!: string;
}