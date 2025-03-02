import { Base } from '../../common/bases/base.entity';
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { DocumentType } from '../enums/document-type.enum';
import { Gender } from '../enums/gender.enum';
import { Role } from '../enums/role.enum';

import { ApiProperty } from '@nestjs/swagger';
import { Address } from './address.entity';
import { Exclude, Expose } from 'class-transformer';
import { SocialWork } from './social-work.entity';
import { SocialWorkEnrollment } from './social-work-enrollment.entity';

@Entity('user')
export abstract class User extends Base {
  @Column({
    type: 'varchar',
    nullable: true,
  })
  @ApiProperty({ example: 'password1234' })
  password?: string;

  @Column({
    type: 'varchar',
    nullable: true,
    unique: true,
  })
  @ApiProperty({ example: 'juan@example.com' })
  email?: string | null;

  @Column({
    type: 'varchar',
    nullable: true,
    unique: true,
  })
  @ApiProperty({ example: 'juan123' })
  username?: string | null;

  @Column({
    type: 'varchar',
    nullable: true
  })
  @ApiProperty({ example: 'urlImagen' })
  urlImg?: string | null;

  @Column({
    type: 'enum',
    nullable: true,
    enum: Role,
  })
  @ApiProperty({
    examples: [Role.PATIENT, Role.ADMIN, Role.INSTITUTION, Role.SPECIALIST],
  })
  role: Role;

  @Column({
    type: 'varchar',
    nullable: true,
    length: 50,
  })
  @ApiProperty({ example: 'David' })
  name: string;

  @Column({
    type: 'varchar',
    nullable: true,
    name: 'last_name',
    length: 50,
  })
  @ApiProperty({ example: 'Peréz' })
  lastName: string;

  @Column({
    type: 'enum',
    enum: Gender,
    nullable: true,
  })
  @ApiProperty({
    examples: [Gender.MALE, Gender.FEMALE, Gender.OTHER, Gender.RATHER_NOT_SAY],
  })
  gender: Gender;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  @ApiProperty({ example: '2000-08-21' })
  birth: string;

  @Column({
    type: 'enum',
    nullable: true,
    enum: DocumentType,
    name: 'document_type',
  })
  @ApiProperty({ examples: [DocumentType.DNI, DocumentType.PASSPORT] })
  documentType: DocumentType | null;

  @Column({
    type: 'varchar',
    nullable: true,
    unique: true,
  })
  @ApiProperty({ examples: ['42.098.163', 'A0123456'] })
  dni: string | null;

  @Column({
    type: 'varchar',
    nullable: true,
    unique: true,
  })
  @ApiProperty({ example: '2615836294' })
  phone?: string | null;

  @JoinTable({
    name: 'person_addresses',
    joinColumn: {
      name: 'person_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'address_id',
      referencedColumnName: 'id',
    },
  })
  addresses: Address[];

  @OneToOne(() => SocialWorkEnrollment, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'social_work_enrollment_id' })
  socialWorkEnrollment?: SocialWorkEnrollment;
}
