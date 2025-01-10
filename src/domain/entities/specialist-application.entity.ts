import { ApiProperty } from '@nestjs/swagger';
import { Base } from '../../common/bases/base.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { DocumentType, Gender } from '../enums';
import { UserApplication } from '.';

@Entity('specialist_applications')
export class SpecialistApplication extends Base {
  @Column({
    type: 'int',
    nullable: false,
    name: 'application_number',
    unique: true
  })
  @ApiProperty({ example: 1 })
  applicationNumber: number;

  @Column({
    type: 'varchar',
    nullable: false,
    unique: true
  })
  @ApiProperty({ example: '2615836294' })
  license: string;

  @Column({
    type: 'varchar',
    nullable: false
  })
  @ApiProperty({ example: 'Pepe' })
  name: string;

  @Column({
    type: 'varchar',
    nullable: false,
    name: 'last_name'
  })
  @ApiProperty({ example: 'Perez' })
  lastName: string;

  @Column({
    type: 'enum',
    enum: DocumentType,
    nullable: false,
    name: 'document_type'
  })
  @ApiProperty({ example: DocumentType.DNI })
  documentType: DocumentType;

  @Column({
    type: 'varchar',
    nullable: false,
    unique: true
  })
  @ApiProperty({ example: '123456' })
  dni: string;

  @Column({
    type: 'enum',
    nullable: false,
    enum: Gender
  })
  @ApiProperty({ example: Gender.MALE })
  gender: Gender;

  @Column({
    type: 'date',
    nullable: false
  })
  @ApiProperty({ example: '1990-01-01' })
  birth: string;

  @Column({
    type: 'uuid',
    nullable: false,
    name: 'degree_id'
  })
  degreeId: string;

  @Column({
    type: 'uuid',
    nullable: false,
    name: 'speciality_id'
  })
  specialityId: string;

  @OneToOne(() => UserApplication, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'soft-delete',
    cascade: true,
    eager: true,
    nullable: false
  })
  @JoinColumn({ name: 'user_application_id' })
  userApplication: UserApplication;
}
