import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';

@Entity()
export class ServiceProvider {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    collation: 'en_US.utf8',
  })
  fullName: string = '';

  @Column({ unique: true })
  cpf: string = '';

  @Column({ unique: true })
  rg: string = '';

  @Column()
  birthDate: Date = new Date();

  @Column({
    collation: 'en_US.utf8',
  })
  address: string = '';

  @Column()
  phone: string = '';

  @Column({ nullable: true })
  photo: string = '';

  @Column({ nullable: true })
  archiveCurriculum: string = '';

  @Column()
  dateOfHire: Date = new Date();

  @Column()
  jobTitle: string = '';

  @Column()
  numberCpts: string = '';

  @Column()
  previousWorkExperience: string = '';

  @Column()
  certifications: string = '';

  @Column()
  coursesCompleted: string = '';

  @Column({ default: true })
  isActive: boolean = true;

  @Column({ nullable: true })
  terminationMessage: string = '';

  @BeforeInsert()
  @BeforeUpdate()
  normalizeName() {
    this.fullName = this.fullName.trim();
  }
}
