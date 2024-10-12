// src/entities/Child.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { ParentChild } from './parent-child.entity';

@Entity()
export class Child {
  @PrimaryGeneratedColumn('uuid')
  id: string = '';

  @Column()
  fullName: string = '';

  @Column()
  birthDate: Date = new Date();

  @Column({ unique: true })
  cpf: string = '';

  @Column()
  address: string = '';

  @Column()
  medicalInfo: string = '';

  @Column({ nullable: true })
  photo: string = '';

  @Column()
  imageUsePermission: boolean = false;

  @OneToMany(() => ParentChild, (parentChild) => parentChild.child)
  parentChildren: ParentChild[] = [];
}