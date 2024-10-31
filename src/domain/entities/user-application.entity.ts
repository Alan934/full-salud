import { ApiProperty } from '@nestjs/swagger';
import { Base } from '../../common/bases/base.entity';
import { Column, Entity } from 'typeorm';
import { ApplicationStatus } from '../enums';

@Entity('user_applications')
export class UserApplication extends Base {
  @Column({
    type: 'varchar',
    nullable: false,
    unique: true
  })
  @ApiProperty({ example: '2615836294' })
  phone: string;

  @Column({
    type: 'varchar',
    nullable: false,
    unique: true
  })
  @ApiProperty({ example: 'prueba@gmail.com' })
  email: string;

  @Column({
    type: 'enum',
    nullable: false,
    enum: ApplicationStatus,
    default: ApplicationStatus.PENDING
  })
  applicationStatus: ApplicationStatus;
}
