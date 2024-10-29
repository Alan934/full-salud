import { ApiProperty } from '@nestjs/swagger';
import { Base } from 'src/common/bases/base.entity';
import { Entity, Column } from 'typeorm';

@Entity('countries')
export class Country extends Base {
  @Column({
    type: 'varchar',
    nullable: false
  })
  @ApiProperty({ example: 'Argentina' })
  name: string;
}
