import { Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import {RelatedPerson } from '.';
import { User } from './User.entity';
import { PatientPractitionerFavorite } from './PatientPractitionerFavorite.entity';
import { Expose } from 'class-transformer';

@Entity('patient')
export class Patient extends User {
  @Expose()
  @ManyToOne(() => RelatedPerson, {
    eager: true,
    nullable: true,
  })
  @JoinColumn({ name: 'relationship_id' })
  relationship: RelatedPerson | null;

  @Expose()
  @OneToMany(() => PatientPractitionerFavorite, (favorite) => favorite.patient)
  favorites: PatientPractitionerFavorite[]
}
