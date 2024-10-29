import { Base } from 'src/common/bases/base.entity';
import { Entity, Column } from 'typeorm';

@Entity('diagnostics')
export class Diagnostic extends Base {
  @Column({
    type: 'varchar',
    nullable: false
  })
  name: string;
}
