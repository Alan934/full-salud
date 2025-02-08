import { Base } from '../../common/bases/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Practitioner, PatientTurn } from '.';

@Entity('clinical_history_accesses')
export class ClinicalHistoryAccess extends Base {
  @Column({
    type: 'time',
    nullable: false,
    name: 'expiration_date'
  })
  expirationDate: string;

  @ManyToOne(() => Practitioner, {
    eager: true
  })
  @JoinColumn({ name: 'practitioner_id' })
  practitioner: Practitioner;

  @ManyToOne(() => PatientTurn, {
    eager: true,
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'patient_turn_id' })
  patientTurn: PatientTurn;
}
