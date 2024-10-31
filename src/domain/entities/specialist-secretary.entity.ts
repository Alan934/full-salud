import { Base } from '../../common/bases/base.entity';
import { Entity, JoinColumn, OneToOne } from 'typeorm';
import { Office, Person } from '.';

@Entity('specialists_secretaries')
export class SpecialistSecretary extends Base {
  @OneToOne(() => Person, {
    orphanedRowAction: 'delete',
    cascade: true,
    eager: true
  })
  @JoinColumn({
    name: 'person_id'
  })
  person: Person;

  @OneToOne(() => Office, (office) => office.secretary, {
    eager: true
  })
  @JoinColumn({
    name: 'office_id'
  })
  office: Office;
}
