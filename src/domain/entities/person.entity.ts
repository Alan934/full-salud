import { Base } from 'src/common/bases/base.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { DocumentType } from '../enums/document-type.enum';
import { Gender } from '../enums/gender.enum';
import { User } from './user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('persons')
export class Person extends Base {
  @Column({
    type: 'varchar',
    nullable: false,
    length: 50
  })
  @ApiProperty({ example: 'David' })
  name: string;

  @Column({
    type: 'varchar',
    nullable: false,
    name: 'last_name',
    length: 50
  })
  @ApiProperty({ example: 'Peréz' })
  lastName: string;

  @Column({
    type: 'enum',
    enum: Gender,
    nullable: false
  })
  @ApiProperty({
    examples: [Gender.MALE, Gender.FEMALE, Gender.OTHER, Gender.RATHER_NOT_SAY]
  })
  gender: Gender;

  @Column({ type: 'date' })
  @ApiProperty({ example: '2000-08-21' })
  birth: Date;

  @Column({
    type: 'enum',
    enum: DocumentType,
    name: 'document_type'
  })
  @ApiProperty({ examples: [DocumentType.DNI, DocumentType.PASSPORT] })
  documentType: DocumentType;

  @Column({
    type: 'varchar',
    nullable: false,
    unique: true
  })
  @ApiProperty({ examples: ['42.098.163', 'A0123456'] })
  dni: string;

  @OneToOne(() => User, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'soft-delete',
    cascade: true,
    eager: true
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
