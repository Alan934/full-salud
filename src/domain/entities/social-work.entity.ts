import { ApiProperty } from '@nestjs/swagger';
import { Base } from '../../common/bases/base.entity';
import { Column, Entity, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { Practitioner, User } from '.';

@Entity('social_work')
export class SocialWork extends Base {
  @Column({
    type: 'varchar',
    nullable: true
  })
  @ApiProperty({ example: 'OSEP' })
  name?: string;

  @Column({
    type: 'varchar',
    nullable: true
  })
  @ApiProperty({ example: '2564859874' })
  phone?: string;

  @Column({
    type: 'varchar',
    nullable: true
  })
  @ApiProperty({ example: 'Basico' })
  plan?: string;

  @Column({
    type: 'varchar',
    nullable: true
  })
  @ApiProperty({ example: '4567' })
  memberNum?: string;

  @Column({
    type: 'varchar',
    nullable: true
  })
  @ApiProperty({ example: 'https://osepmendoza.com.ar/web/' })
  website?: string;

  @OneToMany(() => User, (user) => user.socialWork)
  users: User[];
}
