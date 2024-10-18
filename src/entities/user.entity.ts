// src/entities/user.entity.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    OneToOne,
    JoinColumn,
} from 'typeorm';
import bcrypt from 'bcrypt';
import { UserRole } from '../enums/roles.enum';
import { Parent } from './parent.entity';
import { ServiceProvider } from './service-provider.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ unique: true })
    username: string = '';

    @Column({ unique: true })
    email: string = '';

    @Column({ nullable: true })
    name: string = '';

    @Column()
    password: string = '';

    @Column({ type: 'enum', enum: UserRole })
    role: UserRole = UserRole.NOT_DEFINED;

    @OneToOne(() => Parent, { nullable: true })
    @JoinColumn()
    parent?: Parent;

    @OneToOne(() => ServiceProvider, { nullable: true })
    @JoinColumn()
    serviceProvider?: ServiceProvider;

    /*
    @OneToOne(() => Accountant, { nullable: true })
    @JoinColumn()
    accountant?: Accountant;
    */

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date = new Date();

    @UpdateDateColumn({ type: 'timestamp' })
    lastUpdatedAt: Date = new Date();

    @Column({ type: 'timestamp', nullable: true })
    lastLoginAt: Date | null = null;

    @Column({ type: 'timestamp', nullable: true })
    lastActivityAt: Date | null = null;

    @Column({ default: true })
    isActive: boolean = true;

    @Column({ default: false })
    isDeleted: boolean = false;

    @DeleteDateColumn({ type: 'timestamp', nullable: true })
    deletedAt: Date | null = null;

    public async hashPassword() {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }

    public async comparePassword(password: string): Promise<boolean> {
        return bcrypt.compare(password, this.password);
    }
}