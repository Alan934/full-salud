import { Expose } from 'class-transformer';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import {
  ProfessionalDegree,
  Location,
  PractitionerRole,
  SocialWork,
  PractitionerAppointment
} from '.';
import { User } from './User.entity';
import { PatientPractitionerFavorite } from './PatientPractitionerFavorite.entity';
import { IsOptional } from 'class-validator';

@Entity('practitioner')
export class Practitioner extends User {
  @Expose()
  @Column({
    type: 'varchar',
    nullable: true,
  })
  license: string;

  @Expose()
  @Column({
    type: 'float',
    default: 0.0,
  })
  rating: number = 0;

  @Expose()
  @Column({
    type: 'boolean',
    nullable: true,
    name: 'home_service',
    default: false,
  })
  homeService: boolean;

  @Expose()
  @ManyToOne(() => ProfessionalDegree, {
    eager: true,
  })
  @JoinColumn({ name: 'degree_id' })
  degree: ProfessionalDegree;

  @Expose()
  @ManyToMany(() => PractitionerRole, (practitioner) => practitioner.practitioners, {
    eager: true,
    nullable: true,
  })
  @JoinTable({
    name: 'practitioners_specialities',
    joinColumn: {
      name: 'practitioner_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'speciality_id',
      referencedColumnName: 'id',
    },
  })
  specialities: PractitionerRole[];

  @Expose()
  @OneToMany(
    () => PractitionerAppointment,
    (specialistAttentionHour) => specialistAttentionHour.practitioner,
    {
      eager: true,
      cascade: true,
      nullable: true,
      orphanedRowAction: 'soft-delete',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  )
  specialistAttentionHour: PractitionerAppointment[];

  @Expose()
  @OneToOne(() => PatientPractitionerFavorite, (favorite) => favorite.practitioner)
  favorite: PatientPractitionerFavorite;

  @Expose()
  @IsOptional()
  @ManyToOne(() => Location, (office) => office.practitioners, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'office_id' })
  office?: Location;

}
