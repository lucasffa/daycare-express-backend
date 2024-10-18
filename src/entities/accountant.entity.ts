// src/entities/Accountant.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  BeforeUpdate,
} from "typeorm";

@Entity()
export class Accountant {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({
    collation: "en_US.utf8",
  })
  fullName: string = "";

  @Column({ unique: true })
  cpf: string = "";

  @Column()
  rg: string = "";

  @Column({ unique: true })
  crc: string = "";

  @Column()
  primaryPhone: string = "";

  @Column({ nullable: true })
  secondaryPhone: string = "";

  @Column()
  email: string = "";

  @BeforeInsert()
  @BeforeUpdate()
  normalizeName() {
    this.fullName = this.fullName.trim();
  }
}