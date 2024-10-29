import { Base } from 'src/common/bases/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('medicines')
export class Medicine extends Base {
  @Column({
    type: 'varchar'
  })
  medicine: string;
}
