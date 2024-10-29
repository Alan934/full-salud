import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { PatientTurn, SocialWork } from '.';
import { Base } from 'src/common/bases/base.entity';

@Entity('members_social_works')
export class MemberSocialWork extends Base {
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

  @OneToOne(() => PatientTurn, (patientTurn) => patientTurn.memberSocialWork, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  @JoinColumn({ name: 'patient_turn_id' })
  patientTurn: PatientTurn;
}
