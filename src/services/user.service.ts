// src/services/user.service.ts
import { plainToClass } from 'class-transformer';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDTO } from '../dtos/create-user.dto';
import { UpdateUserDTO } from '../dtos/update-user.dto';
import { UserRole } from '../enums/roles.enum';
import { UserResponseDTO } from '../dtos/user-response.dto';
import { Parent } from '../entities/parent.entity';
import { ServiceProvider } from '../entities/service-provider.entity';


export class UserService {
    private userRepository: Repository<User>;
    private parentRepository: Repository<Parent>;
    // private relativeRepository: Repository<Relative>;
    private serviceProviderRepository: Repository<ServiceProvider>;
    // private accountantRepository: Repository<Accountant>;

    constructor(
        userRepository: Repository<User>,
        parentRepository: Repository<Parent>,
        // relativeRepository: Repository<Relative>,
        serviceProviderRepository: Repository<ServiceProvider>,
        // accountantRepository: Repository<Accountant>
    ) {
        this.userRepository = userRepository;
        this.parentRepository = parentRepository;
        // this.relativeRepository = relativeRepository;
        this.serviceProviderRepository = serviceProviderRepository;
        // this.accountantRepository = accountantRepository;
    }

    async create(data: CreateUserDTO): Promise<UserResponseDTO> {
        if (data.role === UserRole.ADMIN || data.role === UserRole.STAFF) {
            throw new Error('Cannot assign ADMIN or STAFF role during user creation');
        }

        const user = this.userRepository.create({
            username: data.username,
            name: data.name,
            email: data.email,
            password: data.password,
            role: UserRole.NOT_DEFINED,
        });

        await user.hashPassword();

        const savedUser = await this.userRepository.save(user);
        return plainToClass(UserResponseDTO, savedUser);
    }

    async updateRole(userId: string, newRole: UserRole, entityId?: string): Promise<UserResponseDTO> {
        const user = await this.findOneEntity(userId);
        if (!user) {
            throw new Error('User not found');
        }

        if (![UserRole.PARENT, UserRole.RELATIVE, UserRole.SERVICE_PROVIDER, UserRole.ACCOUNTANT].includes(newRole)) {
            throw new Error('Invalid role for assignment');
        }

        user.parent = undefined;
        //user.relative = null;
        user.serviceProvider = undefined;
        //user.accountant = null;

        if (!entityId) throw new Error('Entity ID is required for this role');

        if (newRole === UserRole.PARENT) {
            const parent = await this.parentRepository.findOne({ where: { id: entityId } });
            if (!parent) throw new Error('Parent entity not found');
            user.parent = parent;
        } else if (newRole === UserRole.RELATIVE) {
            /*
            const relative = await this.relativeRepository.findOne({ where: { id: entityId } });
            if (!relative) throw new Error('Relative entity not found');
            user.relative = relative;
            */
        } else if (newRole === UserRole.SERVICE_PROVIDER) {
            const serviceProvider = await this.serviceProviderRepository.findOne({ where: { id: entityId } });
            if (!serviceProvider) throw new Error('Service provider entity not found');
            user.serviceProvider = serviceProvider;
        } else if (newRole === UserRole.ACCOUNTANT) {
            /*
            const accountant = await this.accountantRepository.findOne({ where: { id: entityId } });
            if (!accountant) throw new Error('Accountant entity not found');
            user.accountant = accountant;
            */
        }

        user.role = newRole;
        const updatedUser = await this.userRepository.save(user);
        return plainToClass(UserResponseDTO, updatedUser);
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