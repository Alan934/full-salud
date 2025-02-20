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
  Degree,
  Office,
  PractitionerRole,
  SocialWork,
  SpecialistAttentionHour
} from '.';
import { User } from './user.entity';
import { Favorite } from './favorite.entity';
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
  @ManyToOne(() => Degree, {
    eager: true,
  })
  @JoinColumn({ name: 'degree_id' })
  degree: Degree;

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
  @ManyToMany(() => SocialWork, (socialWork) => socialWork.practitioners, {
    nullable: true,
  })
  @JoinTable({
    name: 'practitioners_social_works',
    joinColumn: {
      name: 'practitioner_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'social_work_id',
      referencedColumnName: 'id',
    },
  })
  acceptedSocialWorks?: SocialWork[];

  @Expose()
  @OneToMany(
    () => SpecialistAttentionHour,
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
  specialistAttentionHour: SpecialistAttentionHour[];

  @Expose()
  @OneToOne(() => Favorite, (favorite) => favorite.practitioner)
  favorite: Favorite;

  @Expose()
  @IsOptional()
  @ManyToOne(() => Office, (office) => office.practitioners, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'office_id' })
  office?: Office;

}
