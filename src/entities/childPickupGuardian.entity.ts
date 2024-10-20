import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  BeforeUpdate,
  ManyToOne,
} from "typeorm";
import { Child } from "./child.entity";

@Entity()
export class ChildPickupGuardian {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  fullName: string = "";

  @Column()
  cpf: string = "";

  @Column()
  rg: string = "";

  @Column()
  relationship: string = "";

  @Column()
  phone: string = "";
  
  @Column()
  isAuthorizedToPickup: boolean = true;

  @Column({ nullable: true })
  parentalConsent: string = "";

  @Column({ nullable: true })
  digitalSignature: string = "";

  @Column()
  identificationDocument: string = "";

  @ManyToOne(() => Child, (child) => child.childPickupGuardians)
  child: Child = new Child();

  @BeforeInsert()
  @BeforeUpdate()
  normalizeName() {
    this.fullName = this.fullName.trim();
  }
}
