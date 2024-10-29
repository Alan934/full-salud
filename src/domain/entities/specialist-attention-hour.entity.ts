import { Base } from 'src/common/bases/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Day } from 'src/domain/enums';
import { ApiProperty } from '@nestjs/swagger';
import { Specialist, Office } from '.';

@Entity('specialists_attention_hours')
export class SpecialistAttentionHour extends Base {
  @Column({
    type: 'time',
    name: 'start_hour',
    nullable: true
  })
  startHour: Date;

  @Column({
    type: 'time',
    name: 'end_hour',
    nullable: true
  })
  endHour: Date;

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
    () => Specialist,
    (specialist) => specialist.specialistAttentionHour
  )
  @JoinColumn({ name: 'specialist_id' })
  specialist: Specialist;

  @ManyToOne(() => Office, (office) => office.specialistAttentionHours, {
    eager: true
  })
  @JoinColumn({ name: 'office_id' })
  office: Office;
}
