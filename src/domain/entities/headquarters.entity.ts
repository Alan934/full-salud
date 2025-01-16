import { Base } from '../../common/bases/base.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne
} from 'typeorm';
import { Address, AttentionHour, Institution, User } from '.';

@Entity('headquarters')
export class Headquarters extends Base {
  @Column({
    type: 'varchar',
    nullable: false
  })
  cuit: string;

  @Column({
    type: 'varchar',
    nullable: false,
    name: 'business_name'
  })
  businessName: string;

  @Column({
    type: 'varchar',
    nullable: false
  })
  phone: string;

  @ManyToOne(() => Institution, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'soft-delete'
  })
  @JoinColumn({ name: 'institution_id' })
  institution: Institution;

  @ManyToOne(() => Address, {
    eager: true,
    cascade: true,
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'address_id' })
  address: Address;

  @OneToMany(
    () => AttentionHour,
    (attentionHour) => attentionHour.headquarters,
    {
      eager: true,
      cascade: true,
      nullable: true,
      orphanedRowAction: 'soft-delete',
      onUpdate: 'CASCADE'
    }
  )
  attentionHours: AttentionHour[];

  @Column({
    type: 'boolean',
    nullable: false,
    default: false,
    name: 'is_main_branch'
  })
  isMainBranch: boolean;
}
