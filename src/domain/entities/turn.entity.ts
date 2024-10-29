import { Base } from 'src/common/bases/base.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import {
  Diagnostic,
  Specialist,
  Institution,
  DerivationImage,
  PatientUserConnection
} from '.';
import { ApiProperty } from '@nestjs/swagger';
import { TurnStatus } from '../enums/turn-status.enum';

@Entity('turns')
export class Turn extends Base {
  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'time' })
  hour: Date;

  @Column({
    type: 'varchar',
    nullable: true
  })
  @ApiProperty({
    example:
      'dolor de pecho opresivo que se irradia hacia el brazo izquierdo, dificultad para respirar y sudoración excesiva'
  })
  observation?: string;

  @Column({
    type: 'date',
    default: null
  })
  estimatedPaymentDate: Date;

  @Column({
    type: 'boolean',
    nullable: false,
    name: 'paid_work_social',
    default: false
  })
  paidWorkSocial: boolean = false;

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

  @ManyToOne(() => Diagnostic, {
    nullable: true,
    eager: true
  })
  @JoinColumn({
    name: 'diagnostic_id'
  })
  diagnostic?: Diagnostic | null;

  @ManyToOne(() => Specialist, {
    eager: true,
    nullable: true
  })
  @JoinColumn({ name: 'specialist_id' })
  specialist?: Specialist;

  @ManyToOne(() => Institution, {
    eager: true,
    nullable: true
  })
  @JoinColumn({
    name: 'institution_id'
  })
  institution?: Institution;

  @OneToMany(() => DerivationImage, (derivationImage) => derivationImage.turn, {
    orphanedRowAction: 'soft-delete',
    cascade: ['update', 'remove', 'soft-remove', 'recover'],
    eager: true
  })
  derivationImages?: DerivationImage[];

  @ManyToOne(() => PatientUserConnection, {
    eager: true,
    onDelete: 'RESTRICT' // No permite eliminar PatientUserConnection
  })
  @JoinColumn({
    name: 'patient_user_connection_id'
  })
  patientUserConnection: PatientUserConnection;

  @Column({
    name: 'available_time',
    nullable: true,
    type: 'varchar'
  })
  @ApiProperty({
    description: 'Horarios y días que el paciente dispone para el turno',
    example: 'Jueves de 07:00 a 09:00 y Lunes de 12:00 a 15:00'
  })
  availableTime: string;
}
