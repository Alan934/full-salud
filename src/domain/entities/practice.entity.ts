import { ApiProperty } from '@nestjs/swagger';
import { Base } from 'src/common/bases/base.entity';
import { Entity, Column } from 'typeorm';

@Entity('practices')
export class Practice extends Base {
  @Column({
    type: 'varchar',
    unique: true,
    nullable: false,
    length: 100
  })
  @ApiProperty({ example: 'Consulta médica' })
  name: string;
}
