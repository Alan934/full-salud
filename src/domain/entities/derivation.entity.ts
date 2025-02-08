import { Base } from '../../common/bases/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { PatientTurn, Practitioner } from '.';

@Entity('derivations')
export class Derivation extends Base {
  @Column({
    type: 'time',
    nullable: false
  })
  date: string;

  @Column({
    type: 'varchar'
  })
  details: string;

  @Column({
    type: 'varchar',
    nullable: false
  })
  speciality: string;

  @ManyToOne(() => PatientTurn, {
    cascade: ['update', 'remove', 'soft-remove', 'recover'],
    lazy: true
  })
  @JoinColumn({ name: 'patient_turn_id' })
  patientTurn: PatientTurn;

  @ManyToOne(() => Practitioner, {
    eager: true
  })
  @JoinColumn({ name: 'practitioner_id' })
  practitioner: Practitioner;
}
