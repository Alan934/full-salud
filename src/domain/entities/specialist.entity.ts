import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { Degree, Speciality, SocialWork, SpecialistAttentionHour } from '.';
import { User } from './user.entity';

@Entity('specialists')
export class Specialist extends User {
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

  @ManyToMany(() => Speciality, (speciality) => speciality.specialists, {
    eager: true,
    nullable: true,
  })
  @JoinTable({
    name: 'specialists_specialities',
    joinColumn: {
      name: 'specialist_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'speciality_id',
      referencedColumnName: 'id',
    },
  })
  specialities: Speciality[];

  @ManyToMany(() => SocialWork, (socialWork) => socialWork.specialists, {
    nullable: true,
  })
  @JoinTable({
    name: 'specialists_social_works',
    joinColumn: {
      name: 'specialist_id',
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
    (specialistAttentionHour) => specialistAttentionHour.specialist,
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
}
