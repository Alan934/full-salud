import { Base } from '../../common/bases/base.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { PatientTurn, Indication, Specialist } from '.';

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

  @ManyToOne(() => Specialist, {
    eager: true,
    nullable: true
  })
  @JoinColumn({ name: 'specialist_id' })
  specialist: Specialist;

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
