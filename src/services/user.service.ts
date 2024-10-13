// src/services/user.service.ts
import { plainToClass } from 'class-transformer';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDTO } from '../dtos/create-user.dto';
import { UpdateUserDTO } from '../dtos/update-user.dto';
import { UserRole } from '../enums/roles.enum';
import { UserResponseDTO } from '../dtos/user-response.dto';

export class UserService {
    private userRepository: Repository<User>;

    constructor(userRepository: Repository<User>) {
        this.userRepository = userRepository;
    }

    async create(data: CreateUserDTO): Promise<UserResponseDTO> {
        if (data.role === UserRole.ADMIN || data.role === UserRole.STAFF) {
            throw new Error('Cannot assign ADMIN or STAFF role during user creation');
        }

        const user = this.userRepository.create({
            username: data.username,
            email: data.email,
            password: data.password,
            role: data.role,
        });

        await user.hashPassword();

        const savedUser = await this.userRepository.save(user);
        return plainToClass(UserResponseDTO, savedUser);
    }

    async findAll(): Promise<UserResponseDTO[]> {
        const users = await this.userRepository.find({ where: { isDeleted: false } });
        return users.map(user => plainToClass(UserResponseDTO, user));
    }

    async findOne(id: string): Promise<UserResponseDTO | null> {
        const user = await this.userRepository.findOne({ where: { id, isDeleted: false } });
        return user ? plainToClass(UserResponseDTO, user) : null;
    }

    async update(id: string, data: UpdateUserDTO): Promise<UserResponseDTO | null> {
        const user = await this.findOne(id);

        if (!user) {
            throw new Error('User not found');
        }

        if (data.role && (data.role === UserRole.ADMIN || data.role === UserRole.STAFF)) {
            throw new Error('Cannot update role to ADMIN or STAFF');
        }

        await this.userRepository.update(id, data);
        const updatedUser = await this.findOne(id);
        return updatedUser ? plainToClass(UserResponseDTO, updatedUser) : null;
    }

    async softDelete(id: string): Promise<void> {
        await this.userRepository.softDelete(id);
        await this.userRepository.update(id, { isDeleted: true, isActive: false });
    }

    async toggleActivate(id: string): Promise<UserResponseDTO | null> {
        const user = await this.findOneEntity(id);
        if (user) {
            user.isActive = !user.isActive;
            const savedUser = await this.userRepository.save(user);
            return plainToClass(UserResponseDTO, savedUser);
        }
        return null;
    }

    async findByEmail(email: string): Promise<UserResponseDTO | null> {
        const user = await this.userRepository.findOne({ where: { email } });
        return user ? plainToClass(UserResponseDTO, user) : null;
    }

    private async findOneEntity(id: string): Promise<User | null> {
        return this.userRepository.findOne({ where: { id, isDeleted: false } });
    }
}