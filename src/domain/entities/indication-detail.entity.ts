import { Base } from '../../common/bases/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Indication } from '.';

@Entity('indications_details')
export class IndicationDetail extends Base {
  @Column({
    type: 'int',
    nullable: false
  })
  order: number;

  @Column({
    type: 'varchar',
    nullable: false
  })
  dose: string;

  @Column({
    type: 'int',
    nullable: false
  })
  period: number;

  @Column({
    type: 'int',
    nullable: false,
    name: 'time_lapse'
  })
  timeLapse: number;

  @ManyToOne(() => Indication, (indication) => indication.indicationsDetails, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'indication_id' })
  indication: Indication;
}
