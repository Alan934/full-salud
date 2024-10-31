import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { DisabilityCard, MemberSocialWork, Person } from '.';
import { Base } from '../../common/bases/base.entity';

@Entity('patient_turns')
export class PatientTurn extends Base {
  @Column({
    type: 'boolean',
    nullable: false,
    name: 'is_disabled',
    default: false
  })
  @ApiProperty({ examples: ['false', 'true'] })
  isDisabled: boolean;

  @OneToOne(() => Person, {
    orphanedRowAction: 'delete',
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    eager: true
  })
  @JoinColumn({ name: 'person_id' })
  person: Person;

  @OneToOne(
    () => MemberSocialWork,
    (memberSocialWork) => memberSocialWork.patientTurn,
    {
      eager: true,
      nullable: true,
      cascade: true
    }
  )
  memberSocialWork: MemberSocialWork;

  @OneToOne(
    () => DisabilityCard,
    (disabilityCard) => disabilityCard.patientTurn,
    {
      onDelete: 'SET NULL',
      nullable: true,
      cascade: ['soft-remove', 'recover'],
      eager: true
    }
  )
  disabilityCard?: DisabilityCard;
}
