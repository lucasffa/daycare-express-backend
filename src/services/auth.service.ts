// src/services/auth.service.ts
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { LoginDTO } from '../dtos/login.dto';
import { Config } from '../configs/environment.config';
import { LoginResponseDTO } from '../dtos/login-response.dto';
import { plainToClass } from 'class-transformer';

export class AuthService {
    private userRepository: Repository<User>;

    constructor(userRepository: Repository<User>) {
        this.userRepository = userRepository;
    }

    async login(data: LoginDTO): Promise<{ user: LoginResponseDTO, token: string }> {
        const user = await this.userRepository.findOne({ where: { email: data.email } });

        if (!user || user.isDeleted || !user.isActive) {
            return Promise.reject({ status: 404, message: 'User not found or inactive' });
        }

        const validPassword = await user.comparePassword(data.password);
        if (!validPassword) {
            return Promise.reject({ status: 401, message: 'Invalid credentials' });
        }

        const token = jwt.sign({
            id: user.id,
            role: user.role,
        },
            Config.getJwtSecret(),
            { expiresIn: '1h' }
        );

        user.lastLoginAt = new Date();
        await this.userRepository.save(user);

        const userResponse = plainToClass(LoginResponseDTO, {
            id: user.id,
            username: user.username,
            name: user.name,
            lastLoginAt: user.lastLoginAt
        });

        return Promise.resolve({ user: userResponse, token });
    }
}