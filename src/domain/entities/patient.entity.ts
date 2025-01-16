import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { PatientTurn, Relationship } from '.';
import { User } from './user.entity';

@Entity('patients')
export class Patient extends User {
  @ManyToOne(() => Relationship, {
    eager: true,
    nullable: true,
  })
  @JoinColumn({ name: 'relationship_id' })
  relationship: Relationship | null;

  @ManyToOne(() => PatientTurn, {
    eager: true,
    cascade: ['insert'],
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'patient_turn_id' })
  patientTurn: PatientTurn;
}
