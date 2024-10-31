import { Base } from '../../common/bases/base.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Prescription, Medicine, IndicationDetail } from '.';

@Entity('indications')
export class Indication extends Base {
  @Column({
    type: 'time',
    default: null,
    nullable: true
  })
  start: Date;

  @ManyToOne(() => Prescription, (prescription) => prescription.indications, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'prescription_id' })
  prescription?: Prescription;

  @ManyToOne(() => Medicine, {
    eager: true
  })
  @JoinColumn({ name: 'medicine_id' })
  medicine: Medicine;

  @OneToMany(
    () => IndicationDetail,
    (indicationDetail) => indicationDetail.indication,
    {
      eager: true,
      cascade: true
    }
  )
  indicationsDetails: IndicationDetail[];
}
