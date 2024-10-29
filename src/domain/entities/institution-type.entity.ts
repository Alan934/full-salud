import { Base } from 'src/common/bases/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('institution_types')
export class InstitutionType extends Base {
  @Column({
    type: 'varchar',
    nullable: false,
    unique: true
  })
  type: string;
}
