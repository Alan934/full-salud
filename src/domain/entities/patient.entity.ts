import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import {RelatedPerson } from '.';
import { User } from './user.entity';
import { PatientPractitionerFavorite } from './patient-practitioner-favorite.entity';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Entity('patient')
export class Patient extends User {

  @Column({
    type: 'varchar',
    nullable: true,
    name: 'email_tutor',
    length: 50,
  })
  @ApiProperty({ example: 'Peréz' })
  emailTutor: string;

  @Column({
    type: 'varchar',
    nullable: true,
    name: 'phone_tutor',
    length: 50,
  })
  @ApiProperty({ example: 'Peréz' })
  phoneTutor: string;

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
