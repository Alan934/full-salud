import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne
} from 'typeorm';
import { PatientTurn, Person, Relationship } from '.';

@Entity('patients')
export class Patient extends Person {

  @ManyToOne(() => Relationship, {
    eager: true,
    nullable: true
  })
  @JoinColumn({ name: 'relationship_id' })
  relationship: Relationship | null;

  @ManyToOne(() => PatientTurn, {
    eager: true,
    cascade: ['insert'],
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'patient_turn_id' })
  patientTurn: PatientTurn;
}

