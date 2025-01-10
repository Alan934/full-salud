import { Base } from '../../common/bases/base.entity';
import { Entity, JoinColumn, OneToOne } from 'typeorm';
import { Office, Specialist } from '.';

@Entity('specialists_secretaries')
export class SpecialistSecretary extends Base {
  @OneToOne(() => Specialist, {
    orphanedRowAction: 'delete',
    cascade: true,
    eager: true
  })
  @JoinColumn({
    name: 'specialist_id'
  })
  person: Specialist;

  @OneToOne(() => Office, (office) => office.secretary, {
    eager: true
  })
  @JoinColumn({
    name: 'office_id'
  })
  office: Office;
}