import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { Patient, SocialWork } from '.';
import { Base } from '../../common/bases/base.entity';

//Esta entidad antes se denominaba MemberSocialWork
@Entity('social_work_enrollment')
export class SocialWorkEnrollment extends Base {
  @Column({
    type: 'varchar',
    nullable: true,
    name: 'member_number'
  })
  memberNum?: string;

  @Column({
    type: 'varchar',
    nullable: false
  })
  plan?: string;

  @ManyToOne(() => SocialWork, {
    eager: true,
    nullable: false
  })
  @JoinColumn({ name: 'social_work_id' })
  socialWork: SocialWork;
  @OneToOne(() => Patient, {
    eager: true,
    nullable: false
  })

  @JoinColumn({ name: 'patient_id' })
  patient: Patient;


}
