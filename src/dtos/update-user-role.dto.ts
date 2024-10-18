// src/dtos/update-user-role.dto.ts
import { IsEnum, IsOptional, IsUUID, ValidateIf } from 'class-validator';
import { UserRole } from '../enums/roles.enum';

export class UpdateUserRoleDTO {
    @IsEnum(UserRole, { message: 'Role inválida fornecida.' })
    role!: UserRole;

    @IsOptional()
    @ValidateIf(o => [UserRole.PARENT, UserRole.RELATIVE, UserRole.SERVICE_PROVIDER].includes(o.role))
    @IsUUID('4', { message: 'entityId deve ser um UUID válido.' })
    entityId?: string;
}