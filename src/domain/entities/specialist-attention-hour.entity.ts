import { Base } from '../../common/bases/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Day } from '../../domain/enums';
import { ApiProperty } from '@nestjs/swagger';
import { Practitioner, Office } from '.';

@Entity('specialists_attention_hours')
export class SpecialistAttentionHour extends Base {
  @Column({
    type: 'time',
    name: 'start_hour',
    nullable: true
  })
  startHour: string;

  @Column({
    type: 'time',
    name: 'end_hour',
    nullable: true
  })
  endHour: string;

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

  @ManyToOne(
    () => Practitioner,
    (practitioner) => practitioner.specialistAttentionHour
  )
  @JoinColumn({ name: 'practitioner_id' })
  practitioner: Practitioner;

  @ManyToOne(() => Office, (office) => office.specialistAttentionHours, {
    eager: true
  })
  @JoinColumn({ name: 'office_id' })
  office: Office;
}
