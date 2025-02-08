import { Base } from '../../common/bases/base.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { PatientTurn, Indication, Practitioner } from '.';

@Entity('prescriptions')
export class Prescription extends Base {
  @Column({
    type: 'date'
  })
  date: string;

  @ManyToOne(() => PatientTurn, {
    eager: true,
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'patient_turn_id' })
  patientTurn: PatientTurn;

  @ManyToOne(() => Practitioner, {
    eager: true,
    nullable: true
  })
  @JoinColumn({ name: 'practitioner_id' })
  practitioner: Practitioner;

  @Column({
    type: 'varchar',
    nullable: true
  })
  observations: string;

  @OneToMany(() => Indication, (indication) => indication.prescription, {
    eager: true,
    cascade: true
  })
  indications?: Indication[];
}
