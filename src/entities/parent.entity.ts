// src/entities/Parent.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { ParentChild } from './parent-child.entity';

@Entity()
export class Parent {
  @PrimaryGeneratedColumn('uuid')
  id: string = '';

  @Column()
  fullName: string = '';

  @Column({ unique: true })
  cpf: string = '';

  @Column()
  rg: string = '';

  @Column()
  address: string = '';

  @Column()
  primaryPhone: string = '';

  @Column({ nullable: true })
  secondaryPhone: string = '';

  @Column()
  profession: string = '';

  @Column()
  workplace: string = '';

  @Column()
  email: string = '';

  @Column({ nullable: true })
  photo: string = '';

  @OneToMany(() => ParentChild, (parentChild) => parentChild.parent)
  parentChildren: ParentChild[] = [];
}