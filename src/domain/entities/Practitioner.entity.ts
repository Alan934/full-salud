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
  PractitionerRole,
  SocialWork,
  SpecialistAttentionHour
} from '.';
import { User } from './user.entity';
import { Favorite } from './favorite.entity';

@Entity('practitioner')
export class Practitioner extends User {
  @Column({
    type: 'varchar',
    nullable: true,
  })
  license: string;

  @Column({
    type: 'float',
    default: 0.0,
  })
  rating: number = 0;

  @Column({
    type: 'boolean',
    nullable: true,
    name: 'home_service',
    default: false,
  })
  homeService: boolean;

  @ManyToOne(() => Degree, {
    eager: true,
  })
  @JoinColumn({ name: 'degree_id' })
  degree: Degree;

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

  @OneToOne(() => Favorite, (favorite) => favorite.practitioner)
  favorite: Favorite;
}
