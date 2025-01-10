import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany
} from 'typeorm';
import { Address, PatientTurn, Person, Relationship, Turn, User } from '.';

@Entity('patients')
export class Patient extends Person {
  @Column({
    nullable: false,
    type: 'varchar'
  })
  phone: string;

  @ManyToOne(() => Relationship, {
    eager: true,
    nullable: true
  })
  @JoinColumn({ name: 'relationship_id' })
  relationship: Relationship | null;

  @ManyToOne(() => User, {
    onDelete: 'SET NULL', // Si se elimina el usuario, se marcará la relación en null pero no se eliminará la tabla Patient
    eager: true
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => PatientTurn, {
    eager: true,
    cascade: ['insert'],
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'patient_turn_id' })
  patientTurn: PatientTurn;
}

