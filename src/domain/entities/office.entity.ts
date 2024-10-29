import { Base } from 'src/common/bases/base.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { Address, SpecialistAttentionHour, SpecialistSecretary } from '.';
import { ApiProperty } from '@nestjs/swagger';

@Entity('offices')
export class Office extends Base {
  @Column({
    type: 'varchar'
  })
  @ApiProperty({
    example: 'Consultorio del Parque'
  })
  name: string;

  @Column({
    type: 'varchar',
    nullable: true
  })
  @ApiProperty({
    example: '2615623164'
  })
  phone: string;

  @OneToMany(
    () => SpecialistAttentionHour,
    (specialistAttentionHour) => specialistAttentionHour.office,
    {
      lazy: true,
      cascade: true,
      orphanedRowAction: 'disable',
      onUpdate: 'CASCADE'
    }
  )
  specialistAttentionHours:
    | Promise<SpecialistAttentionHour[]>
    | SpecialistAttentionHour[];

  @OneToOne(() => Address, {
    cascade: true,
    eager: true,
    onUpdate: 'CASCADE'
  })
  @JoinColumn({
    name: 'address_id'
  })
  address: Address;

  @OneToOne(() => SpecialistSecretary, (secretary) => secretary.office, {
    lazy: true
  })
  secretary: Promise<SpecialistSecretary> | SpecialistSecretary;
}
