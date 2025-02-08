import { Base } from '../../common/bases/base.entity';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Practitioner } from './Practitioner.entity';
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

  @ManyToOne(() => Practitioner, {
    onDelete: 'CASCADE',
    cascade: true,
    orphanedRowAction: 'soft-delete',
    eager: true
  })
  @JoinColumn({ name: 'practitioner_id' })
  practitioner: Practitioner;

  @ManyToOne(() => Practice, {
    onDelete: 'CASCADE',
    cascade: true,
    orphanedRowAction: 'soft-delete',
    eager: true
  })
  @JoinColumn({ name: 'practice_id' })
  practice: Practice;
}
