import { Base } from '../../common/bases/base.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { UserApplication } from '.';

@Entity('institution_applications')
export class InstitutionApplication extends Base {
  @Column({
    type: 'int',
    nullable: false,
    name: 'application_number',
    unique: true
  })
  applicationNumber: number;

  @Column({
    type: 'varchar',
    nullable: false
  })
  cuit: string;

  @Column({
    type: 'varchar',
    nullable: false,
    name: 'business_name'
  })
  businessName: string;

  @OneToOne(() => UserApplication, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'soft-delete',
    cascade: true,
    eager: true,
    nullable: false
  })
  @JoinColumn({ name: 'user_application_id' })
  userApplication: UserApplication;

  @Column({
    type: 'uuid',
    nullable: false,
    name: 'institution_type_id'
  })
  institutionTypeId: string;
}
