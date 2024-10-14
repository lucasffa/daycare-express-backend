// src/entities/ParentChild.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { Parent } from './parent.entity';
import { Child } from './child.entity';
import { GuardianshipType } from '../enums/guardianship-type.enum';

@Entity()
export class ParentChild {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Parent, (parent) => parent.parentChildren)
  parent: Parent = new Parent();

  @ManyToOne(() => Child, (child) => child.parentChildren)
  child: Child = new Child();

  @Column({
    type: 'enum',
    enum: GuardianshipType,
  })
  guardianshipType: GuardianshipType = GuardianshipType.UNILATERAL;

  @Column()
  kinshipDegree: string = '';

  @Column({ nullable: true })
  additionalInfo: string = '';

  @Column()
  isAuthorizedToPickup: boolean = false;
}