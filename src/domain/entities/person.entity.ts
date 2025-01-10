import { Base } from '../../common/bases/base.entity';
import { Column, Entity, JoinColumn, JoinTable, OneToOne } from 'typeorm';
import { DocumentType } from '../enums/document-type.enum';
import { Gender } from '../enums/gender.enum';
import { User } from './user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Address } from './address.entity';


export abstract class Person extends Base {
  @Column({
    type: 'varchar',
    nullable: true,
    length: 50
  })
  @ApiProperty({ example: 'David' })
  name: string;

  @Column({
    type: 'varchar',
    nullable: true,
    name: 'last_name',
    length: 50
  })
  @ApiProperty({ example: 'Peréz' })
  lastName: string;

  @Column({
    type: 'enum',
    enum: Gender,
    nullable: true
  })
  @ApiProperty({
    examples: [Gender.MALE, Gender.FEMALE, Gender.OTHER, Gender.RATHER_NOT_SAY]
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
    enum: DocumentType,
    name: 'document_type'
  })
  @ApiProperty({ examples: [DocumentType.DNI, DocumentType.PASSPORT] })
  documentType: DocumentType;

  @Column({
    type: 'varchar',
    nullable: true,
    unique: true
  })
  @ApiProperty({ examples: ['42.098.163', 'A0123456'] })
  dni: string;

  @Column({
    type: 'varchar',
    nullable: true,
    unique: true
  })
  @ApiProperty({ example: '2615836294' })
  phone?: string;

    @JoinTable({
      name: 'person_addresses',
      joinColumn: {
        name: 'person_id',
        referencedColumnName: 'id'
      },
      inverseJoinColumn: {
        name: 'address_id',
        referencedColumnName: 'id'
      }
    })
    addresses: Address[];
}
