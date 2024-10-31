import { ApiProperty } from '@nestjs/swagger';
import { Base } from '../../common/bases/base.entity';
import { Column, Entity, ManyToMany } from 'typeorm';
import { Specialist } from '.';

@Entity('social_works')
export class SocialWork extends Base {
  @Column({
    type: 'varchar',
    nullable: false
  })
  @ApiProperty({ example: 'OSEP' })
  name: string;

  @ManyToMany(() => Specialist, (specialist) => specialist.acceptedSocialWorks)
  specialists: Specialist[];
}
