import { Base } from 'src/common/bases/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Country } from './country.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('provinces')
export class Province extends Base {
  @Column({
    type: 'varchar',
    nullable: false
  })
  @ApiProperty({ example: 'Mendoza' })
  name: string;

  @ManyToOne(() => Country, {
    eager: true
  })
  @JoinColumn({ name: 'country_id' })
  country: Country;
}
