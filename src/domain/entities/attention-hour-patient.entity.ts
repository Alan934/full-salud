import { Base } from '../../common/bases/base.entity';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Day } from '../../domain/enums';
import { ApiProperty } from '@nestjs/swagger';
import { Turn } from '../../domain/entities';

@Entity('attention_hours_patient')
export class AttentionHourPatient extends Base {
  @Column({
    type: 'time',
    name: 'opening_hour',
    nullable: true
  })
  openingHour: string;

  @Column({
    type: 'time',
    name: 'close_hour',
    nullable: true
  })
  closeHour: string;

  @Column({
    type: 'enum',
    enum: Day
  })
  @ApiProperty({
    examples: [
      Day.SUNDAY,
      Day.MONDAY,
      Day.TUESDAY,
      Day.WEDNESDAY,
      Day.THURSDAY,
      Day.FRIDAY,
      Day.SATURDAY
    ]
  })
  day: Day;

  @ManyToOne(() => Turn, (turn) => turn.attentionHourPatient)
  @JoinColumn({ name: 'turn_id' })
  turn: Turn;
}
