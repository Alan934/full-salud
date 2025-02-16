import { Base } from '../../common/bases/base.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { Address, AttentionHour, Practitioner, SpecialistAttentionHour, SpecialistSecretary } from '.';
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

  @OneToMany(() => Practitioner, (practitioner) => practitioner.office, {
    cascade: true,
  })
  practitioners: Practitioner[];  

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

  @OneToMany(
    () => AttentionHour,
    (attentionHour) => attentionHour.office,
    {
      eager: true,
      cascade: true,
      nullable: true,
      orphanedRowAction: 'soft-delete',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  )
  attentionHour: AttentionHour[];
}
