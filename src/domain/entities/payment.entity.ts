import { Base } from 'src/common/bases/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { SocialWork, Speciality } from '.';

@Entity('payments')
export class Payment extends Base {
  @Column({
    type: 'int',
    nullable: false,
    name: 'payment_time'
  })
  paymentTime: number;

  @ManyToOne(() => SocialWork, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'soft-delete',
    cascade: ['update', 'remove', 'soft-remove', 'recover'],
    eager: true
  })
  @JoinColumn({ name: 'social_work_id' })
  socialWork: SocialWork;

  @ManyToOne(() => Speciality, {
    eager: true
  })
  @JoinColumn({ name: 'speciality_id' })
  speciality: Speciality;
}
