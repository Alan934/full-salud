import { Base } from '../../common/bases/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('tags')
export class Tag extends Base {
  @Column({
    type: 'varchar',
    unique: true,
    nullable: false
  })
  name: string;
}
