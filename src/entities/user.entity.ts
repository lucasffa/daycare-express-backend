// src/entities/user.entity.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    BeforeInsert,
    BeforeUpdate,
} from 'typeorm';
import bcrypt from 'bcrypt';
import { UserRole } from '../enums/roles.enum';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string = '';

    @Column({ unique: true })
    username: string = '';

    @Column({ unique: true })
    email: string = '';

    @Column()
    password: string = '';

    @Column({ type: 'enum', enum: UserRole })
    role: UserRole = UserRole.PARENT;

    @CreateDateColumn()
    createdAt: Date = new Date();

    @UpdateDateColumn()
    lastUpdatedAt: Date = new Date();

    @Column({ nullable: true })
    lastLoginAt: Date | null = null;

    @Column({ nullable: true })
    lastActivityAt: Date | null = null;

    @Column({ default: true })
    isActive: boolean = true;

    @Column({ default: false })
    isDeleted: boolean = false;

    @DeleteDateColumn()
    deletedAt: Date | null = null;

    @BeforeInsert()
    @BeforeUpdate()
    private async hashPassword() {
        if (this.password) {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
        }
    }

    public async comparePassword(password: string): Promise<boolean> {
        return bcrypt.compare(password, this.password);
    }
}