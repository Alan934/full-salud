import { Base } from '../../common/bases/base.entity';
import { Entity, JoinColumn, OneToOne } from 'typeorm';
import { Office, Practitioner } from '.';

@Entity('specialists_secretaries')
export class SpecialistSecretary extends Base {
  @OneToOne(() => Practitioner, {
    orphanedRowAction: 'delete',
    cascade: true,
    eager: true
  })
  @JoinColumn({
    name: 'practitioner_id'
  })
  practitioner: Practitioner;

  @OneToOne(() => Office, (office) => office.secretary, {
    eager: true
  })
  @JoinColumn({
    name: 'office_id'
  })
  office: Office;
}