import { Base } from '../../common/bases/base.entity';
import { Column, Entity, JoinTable } from 'typeorm';
import { DocumentType } from '../enums/document-type.enum';
import { Gender } from '../enums/gender.enum';
import { Role } from '../enums/role.enum';

import { ApiProperty } from '@nestjs/swagger';
import { Address } from './address.entity';
import { Expose } from 'class-transformer';

@Entity('users')
export abstract class User extends Base {
  @Expose()
  @Column({
    type: 'varchar',
    nullable: true,
  })
  @ApiProperty({ example: 'password1234' })
  password?: string;

  @Expose()
  @Column({
    type: 'varchar',
    nullable: true,
    unique: true,
  })
  @ApiProperty({ example: 'juan@example.com' })
  email?: string | null;

  @Expose()
  @Column({
    type: 'varchar',
    nullable: true,
    unique: true,
  })
  @ApiProperty({ example: 'juan123' })
  username?: string | null;

  @Expose()
  @Column({
    type: 'varchar',
    nullable: true
  })
  @ApiProperty({ example: 'urlImagen' })
  urlImg?: string | null;

  @Expose()
  @Column({
    type: 'enum',
    nullable: true,
    enum: Role,
  })
  @ApiProperty({
    examples: [Role.PATIENT, Role.ADMIN, Role.INSTITUTION, Role.SPECIALIST],
  })
  role: Role;

  @Expose()
  @Column({
    type: 'varchar',
    nullable: true,
    length: 50,
  })
  @ApiProperty({ example: 'David' })
  name: string;

  @Expose()
  @Column({
    type: 'varchar',
    nullable: true,
    name: 'last_name',
    length: 50,
  })
  @ApiProperty({ example: 'Peréz' })
  lastName: string;

  @Expose()
  @Column({
    type: 'enum',
    enum: Gender,
    nullable: true,
  })
  @ApiProperty({
    examples: [Gender.MALE, Gender.FEMALE, Gender.OTHER, Gender.RATHER_NOT_SAY],
  })
  gender: Gender;

  @Expose()
  @Column({
    type: 'varchar',
    nullable: true,
  })
  @ApiProperty({ example: '2000-08-21' })
  birth: string;

  @Expose()
  @Column({
    type: 'enum',
    nullable: true,
    enum: DocumentType,
    name: 'document_type',
  })
  @ApiProperty({ examples: [DocumentType.DNI, DocumentType.PASSPORT] })
  documentType: DocumentType | null;

  @Expose()
  @Column({
    type: 'varchar',
    nullable: true,
    unique: true,
  })
  @ApiProperty({ examples: ['42.098.163', 'A0123456'] })
  dni: string | null;

  @Expose()
  @Column({
    type: 'varchar',
    nullable: true,
    unique: true,
  })
  @ApiProperty({ example: '2615836294' })
  phone?: string | null;

  @Expose()
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

  // @Column({
  //   type: 'varchar',
  //   nullable: true,
  // })
  // @ApiProperty({ example: 'hashed_refresh_token' })
  // refreshToken?: string;

}
