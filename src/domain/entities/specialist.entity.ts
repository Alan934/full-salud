import { Base } from '../../common/bases/base.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne
} from 'typeorm';
import {
  Degree,
  Person,
  Speciality,
  SocialWork,
  SpecialistAttentionHour,
  Turn,
  User
} from '.';
import { ApiProperty } from '@nestjs/swagger';

@Entity('specialists')
export class Specialist extends Person {
  @Column({
    type: 'varchar',
    nullable: false
  })
  @ApiProperty({ example: '123456-M-BA' })
  license: string;

  @Column({
    type: 'float',
    default: 0.0
  })
  rating: number = 0;

  @Column({
    type: 'boolean',
    nullable: false,
    name: 'home_service',
    default: false
  })
  homeService: boolean;

  @ManyToOne(() => Degree, {
    eager: true
  })
  @JoinColumn({ name: 'degree_id' })
  degree: Degree;

  @ManyToMany(() => Speciality, (speciality) => speciality.specialists, {
    eager: true,
    cascade: true,
  })
  @JoinTable({
    name: 'specialists_specialities', // Nombre de la tabla de relación
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

  @ManyToMany(() => SocialWork, (socialWork) => socialWork.specialists)
  @JoinTable({
    name: 'specialists_social_works',
    joinColumn: {
      name: 'specialist_id',
      referencedColumnName: 'id'
    },
    inverseJoinColumn: {
      name: 'social_work_id',
      referencedColumnName: 'id'
    }
  })
  acceptedSocialWorks?: SocialWork[];

  @OneToMany(
    () => SpecialistAttentionHour,
    (specialistAtenttionHour) => specialistAtenttionHour.specialist,
    {
      eager: true,
      cascade: true,
      nullable: true,
      orphanedRowAction: 'soft-delete',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    }
  )
  specialistAttentionHour: SpecialistAttentionHour[];
}

