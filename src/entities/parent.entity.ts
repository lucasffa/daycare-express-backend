// src/entities/Parent.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { ParentChild } from './parent-child.entity';
import { removeAccents } from '../utils/chars.util';

@Entity()
export class Parent {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    collation: 'en_US.utf8'
  })
  fullName: string = '';

  @Column({ unique: true })
  cpf: string = '';

  @Column()
  rg: string = '';

  @Column({
    collation: 'en_US.utf8'
  })
  address: string = '';

  @Column()
  primaryPhone: string = '';

  @Column({ nullable: true })
  secondaryPhone: string = '';

  @Column({
    collation: 'en_US.utf8'
  })
  profession: string = '';

  @Column({
    collation: 'en_US.utf8'
  })
  workplace: string = '';

  @Column()
  email: string = '';

  @Column({ nullable: true })
  photo: string = '';

  @OneToMany(() => ParentChild, (parentChild) => parentChild.parent)
  parentChildren!: ParentChild[];

  @BeforeInsert()
  @BeforeUpdate()
  normalizeName() {
    this.fullName = this.fullName.trim();
  }
}