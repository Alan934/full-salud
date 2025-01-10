import {
  Base,
} from '../../common/bases/base.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import {
  Diagnostic,
  Specialist,
  Patient,
  DerivationImage,
  AttentionHourPatient
} from '.';
import { ApiProperty } from '@nestjs/swagger';
import { TurnStatus } from '../enums/turn-status.enum';

@Entity('turn')
export class Turn extends Base {
  @Column({ type: 'varchar' })
  date: string;

  @Column({ type: 'varchar' })
  hour: string;

  @Column({
    type: 'varchar',
    nullable: true
  })
  @ApiProperty({
    example: 'dolor de pecho opresivo que se irradia hacia el brazo izquierdo, dificultad para respirar y sudoración excesiva'
  })
  observation?: string;

  @Column({
    type: 'enum',
    enum: TurnStatus,
    nullable: false,
    default: TurnStatus.PENDING
  })
  @ApiProperty({
    examples: [
      TurnStatus.APPROVED,
      TurnStatus.CANCELLED,
      TurnStatus.COMPLETED,
      TurnStatus.NO_SHOW,
      TurnStatus.PENDING,
      TurnStatus.UNDER_REVIEW
    ],
    default: TurnStatus.PENDING
  })
  status: TurnStatus;

  // Relación con Patient: un paciente puede tener muchos turnos, pero cada turno pertenece a un solo paciente
  @ManyToOne(() => Patient, (patient) => patient, {
    eager: false,
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;
  
  @ManyToMany(() => Specialist, (specialist) => specialist, {
    eager: false,
  })
  @JoinTable({
    name: 'turns_specialists',
    joinColumn: {
      name: 'turn_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'specialist_id',
      referencedColumnName: 'id',
    },
  })
  specialists: Specialist[];

  @OneToMany(
    () => AttentionHourPatient,
    (attentionHour) => attentionHour.turn,
    {
      eager: true,
      cascade: true,
      nullable: true,
      orphanedRowAction: 'soft-delete',
      onUpdate: 'CASCADE'
    }
  )
  attentionHourPatient: AttentionHourPatient[];

  @OneToMany(() => DerivationImage, (derivationImage) => derivationImage.turn, {
    orphanedRowAction: 'soft-delete',
    cascade: ['update', 'remove', 'soft-remove', 'recover'],
    eager: true
  })
  derivationImages?: DerivationImage[];
}

