import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne
} from 'typeorm';
import { Address, PatientTurn, Relationship, User } from '.';
import { Base } from 'src/common/bases/base.entity';

@Entity('patients_users_connections')
export class PatientUserConnection extends Base {
  @Column({
    nullable: false,
    type: 'varchar'
  })
  phone: string;

  @ManyToOne(() => Relationship, {
    eager: true,
    nullable: true
  })
  @JoinColumn({ name: 'relationship_id' })
  relationship: Relationship | null;

  @ManyToOne(() => User, {
    onDelete: 'SET NULL', // Si se elimina el usuario, se marcará la relación en null pero no se eliminará la tabla PatientUserConnection
    eager: true
  })
  @JoinColumn({ name: 'reserved_by_user_id' })
  user: User;

  @ManyToOne(() => PatientTurn, {
    eager: true,
    cascade: ['insert'],
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'patient_turn_id' })
  patientTurn: PatientTurn;

  @ManyToMany(() => Address, {
    cascade: true
  })
  @JoinTable({
    name: 'patient_addresses',
    joinColumn: {
      name: 'patient_id',
      referencedColumnName: 'id'
    },
    inverseJoinColumn: {
      name: 'address_id',
      referencedColumnName: 'id'
    }
  })
  addresses: Address[];
}
