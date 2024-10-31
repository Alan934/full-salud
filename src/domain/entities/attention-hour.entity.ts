import { Base } from '../../common/bases/base.entity';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Day } from '../../domain/enums';
import { ApiProperty } from '@nestjs/swagger';
import { Headquarters } from '../../domain/entities';

@Entity('attention_hours')
export class AttentionHour extends Base {
  @Column({
    type: 'time',
    name: 'opening_hour',
    nullable: true
  })
  openingHour: Date;

  @Column({
    type: 'time',
    name: 'close_hour',
    nullable: true
  })
  closeHour: Date;

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

  @ManyToOne(() => Headquarters, (headquarters) => headquarters.attentionHours)
  @JoinColumn({ name: 'headquarters_id' })
  headquarters: Headquarters;
}
