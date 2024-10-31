import { Base } from '../../common/bases/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('examples')
export class Examples extends Base {
  @Column({
    type: 'varchar',
    nullable: false
  })
  firstName: string;

  @Column({
    type: 'varchar',
    nullable: false
  })
  lastName: string;
}
