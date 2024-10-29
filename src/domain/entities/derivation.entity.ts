import { Base } from 'src/common/bases/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { PatientTurn, Specialist } from '.';

@Entity('derivations')
export class Derivation extends Base {
  @Column({
    type: 'time',
    nullable: false
  })
  date: Date;

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

  @ManyToOne(() => Specialist, {
    eager: true
  })
  @JoinColumn({ name: 'specialist_id' })
  specialist: Specialist;
}
