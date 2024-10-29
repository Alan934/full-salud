import { Base } from 'src/common/bases/base.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany
} from 'typeorm';
import { Iva } from './iva.entity';
import { ApiProperty } from '@nestjs/swagger';
import { InstitutionType, Commission, Headquarters } from '.';

@Entity('institutions')
export class Institution extends Base {
  @Column({
    type: 'varchar',
    nullable: false
  })
  @ApiProperty({ example: '30701234567' })
  cuit: string;

  @Column({
    type: 'varchar',
    nullable: false,
    name: 'business_name'
  })
  @ApiProperty({ example: 'Centro Médico' })
  businessName: string;

  @ManyToOne(() => Iva, {
    eager: true
  })
  @JoinColumn({ name: 'iva_id' })
  iva: Iva;

  @ManyToOne(() => InstitutionType, {
    eager: true
  })
  @JoinColumn({ name: 'institution_type_id' })
  institutionType: InstitutionType;

  @ManyToMany(() => Commission, (commission) => commission.institutions)
  commissions: Commission[];

  @OneToMany(() => Headquarters, (headquarters) => headquarters.institution, {
    cascade: ['soft-remove', 'recover'],
    orphanedRowAction: 'soft-delete',
    eager: true
  })
  headquarters: Headquarters[];
}
