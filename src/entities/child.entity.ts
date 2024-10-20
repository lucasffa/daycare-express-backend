// src/entities/Child.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  BeforeInsert,
  BeforeUpdate,
} from "typeorm";
import { ParentChild } from "./parent-child.entity";
import { ChildPickupGuardian } from "./childPickupGuardian.entity";

@Entity()
export class Child {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({
    collation: "en_US.utf8",
  })
  fullName: string = "";

  @Column()
  birthDate: Date = new Date();

  @Column({ unique: true })
  cpf: string = "";

  @Column({
    collation: "en_US.utf8",
  })
  address: string = "";

  @Column()
  medicalInfo: string = "";

  @Column({ nullable: true })
  photo: string = "";

  @Column()
  imageUsePermission: boolean = false;

  @OneToMany(() => ParentChild, (parentChild) => parentChild.child)
  parentChildren!: ParentChild[];

  @OneToMany(() => ChildPickupGuardian,(childPickupGuardians) => childPickupGuardians.child)
  childPickupGuardians!: ChildPickupGuardian[];

  @BeforeInsert()
  @BeforeUpdate()
  normalizeName() {
    this.fullName = this.fullName.trim();
  }
}
