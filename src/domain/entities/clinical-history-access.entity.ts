import { Base } from 'src/common/bases/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Specialist, PatientTurn } from '.';

@Entity('clinical_history_accesses')
export class ClinicalHistoryAccess extends Base {
  @Column({
    type: 'time',
    nullable: false,
    name: 'expiration_date'
  })
  expirationDate: Date;

  @ManyToOne(() => Specialist, {
    eager: true
  })
  @JoinColumn({ name: 'specialist_id' })
  specialist: Specialist;

  @ManyToOne(() => PatientTurn, {
    eager: true,
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'patient_turn_id' })
  patientTurn: PatientTurn;
}
