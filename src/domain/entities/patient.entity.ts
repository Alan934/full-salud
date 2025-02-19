import { Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { PatientTurn, Relationship } from '.';
import { User } from './user.entity';
import { Favorite } from './favorite.entity';
import { Expose } from 'class-transformer';

@Entity('patients')
export class Patient extends User {
  @Expose()
  @ManyToOne(() => Relationship, {
    eager: true,
    nullable: true,
  })
  @JoinColumn({ name: 'relationship_id' })
  relationship: Relationship | null;

  @Expose()
  @ManyToOne(() => PatientTurn, {
    eager: true,
    cascade: ['insert'],
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'patient_turn_id' })
  patientTurn: PatientTurn;

  @Expose()
  @OneToMany(() => Favorite, (favorite) => favorite.patient)
  favorites: Favorite[]
}
