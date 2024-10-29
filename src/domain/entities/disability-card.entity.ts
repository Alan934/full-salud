import { Base } from 'src/common/bases/base.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { DisabilityCardImage, PatientTurn } from '.';

@Entity('disability_cards')
export class DisabilityCard extends Base {
  @Column({
    type: 'varchar',
    nullable: false,
    name: 'card_number'
  })
  cardNumber: string;

  @Column({
    type: 'date',
    nullable: false,
    name: 'expiration_date'
  })
  expirationDate: Date;

  @OneToOne(() => PatientTurn, (patientTurn) => patientTurn.disabilityCard, {
    lazy: true
  })
  @JoinColumn({ name: 'patient_turn_id' })
  patientTurn?: PatientTurn;

  @OneToMany(
    () => DisabilityCardImage,
    (disabilityCardImage) => disabilityCardImage.disabilityCard,
    {
      cascade: true,
      orphanedRowAction: 'delete',
      eager: true
    }
  )
  disabilityCardImages?: DisabilityCardImage[];
}
