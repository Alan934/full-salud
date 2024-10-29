import { ApiProperty } from '@nestjs/swagger';
import { Base } from 'src/common/bases/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('relationships')
export class Relationship extends Base {
  @Column({
    type: 'varchar',
    unique: true
  })
  @ApiProperty({ example: 'Hijo' })
  relation: string;
}
