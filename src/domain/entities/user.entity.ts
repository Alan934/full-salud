import { Base } from '../../common/bases/base.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Role } from '../enums/role.enum';
import { ProfileImage } from '.';
import { ApiProperty } from '@nestjs/swagger';

@Entity('users')
export class User extends Base {
  @Column({
    type: 'varchar'
  })
  @ApiProperty({ example: 'password1234' })
  password?: string;

  @Column({
    type: 'varchar',
    nullable: false,
    unique: true
  })
  @ApiProperty({ example: 'juan@example.com' })
  email: string;

  @Column({
    type: 'varchar',
    nullable: true,
    unique: true
  })
  @ApiProperty({ example: 'juan123' })
  username?: string;

  @Column({
    type: 'enum',
    enum: Role
  })
  @ApiProperty({
    examples: [Role.PATIENT, Role.ADMIN, Role.INSTITUTION, Role.SPECIALIST]
  })
  role: Role;

  @OneToOne(() => ProfileImage, {
    orphanedRowAction: 'soft-delete',
    cascade: true,
    eager: true
  })
  @JoinColumn({ name: 'profile_image_id' })
  profileImage: ProfileImage;
}
