import { Base } from '../../common/bases/base.entity';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Specialist } from './specialist.entity';
import { Practice } from './practice.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('prices')
export class Price extends Base {
  @Column({
    type: 'float',
    nullable: false
  })
  @ApiProperty({ example: '8000' })
  price: number;

  @ManyToOne(() => Specialist, {
    onDelete: 'CASCADE',
    cascade: true,
    orphanedRowAction: 'soft-delete',
    eager: true
  })
  @JoinColumn({ name: 'specialist_id' })
  specialist: Specialist;

  @ManyToOne(() => Practice, {
    onDelete: 'CASCADE',
    cascade: true,
    orphanedRowAction: 'soft-delete',
    eager: true
  })
  @JoinColumn({ name: 'practice_id' })
  practice: Practice;
}
