import { Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { PatientTurn, Relationship } from '.';
import { User } from './user.entity';
import { Favorite } from './favorite.entity';

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

  @OneToMany(() => Favorite, (favorite) => favorite.patient)
  favorites: Favorite[]
}
