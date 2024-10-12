// src/services/user.service.ts
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDTO } from '../dtos/create-user.dto';
import { UpdateUserDTO } from '../dtos/update-user.dto';

export class UserService {
    private userRepository: Repository<User>;

    constructor(userRepository: Repository<User>) {
        this.userRepository = userRepository;
    }

    async create(data: CreateUserDTO): Promise<User> {
        const user = this.userRepository.create(data);
        return this.userRepository.save(user);
    }

    async findAll(): Promise<User[]> {
        return this.userRepository.find({ where: { isDeleted: false } });
    }

    async findOne(id: string): Promise<User | null> {
        return this.userRepository.findOne({ where: { id, isDeleted: false } });
    }

    async update(id: string, data: UpdateUserDTO): Promise<User | null> {
        await this.userRepository.update(id, data);
        return this.findOne(id);
    }

    async softDelete(id: string): Promise<void> {
        await this.userRepository.softDelete(id);
        await this.userRepository.update(id, { isDeleted: true, isActive: false });
    }

    async toggleActivate(id: string): Promise<User | null> {
        const user = await this.findOne(id);
        if (user) {
            user.isActive = !user.isActive;
            await this.userRepository.save(user);
            return user;
        }
        return null;
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.userRepository.findOne({ where: { email } });
    }
}