import { Column, JoinColumn, ManyToOne } from 'typeorm';
import { Media } from '../enums/media.enum';
import { Base } from 'src/common/bases/base.entity';
import { User } from './user.entity';
import { ApiProperty } from '@nestjs/swagger';

export abstract class NotificationPreferences extends Base {
  @Column({
    type: 'timestamp',
    name: 'start_hour',
    nullable: true
  })
  @ApiProperty({ examples: ['2024-08-27T08:30:00'] })
  startHour: Date;

  @Column({
    type: 'timestamp',
    name: 'end_hour',
    nullable: true
  })
  @ApiProperty({ examples: ['2024-08-27T12:30:00'] })
  endHour: Date;

  @Column({
    type: 'enum',
    enum: Media
  })
  @ApiProperty({ examples: [Media.EMAIL, Media.WHATSAPP] })
  media: Media;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    orphanedRowAction: 'soft-delete',
    cascade: true
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
}

export abstract class MedicalProviderNotificationPreferences extends NotificationPreferences {
  @Column({
    type: 'boolean',
    name: 'weekly_patients_list',
    default: true
  })
  @ApiProperty({ examples: ['false', 'true'] })
  weeklyPatientsList: boolean;

  @Column({
    type: 'boolean',
    name: 'cancelled_turns',
    default: true
  })
  @ApiProperty({ examples: ['false', 'true'] })
  cancelledTurns: boolean;

  @Column({
    type: 'boolean',
    name: 'monthly_stats',
    default: true
  })
  @ApiProperty({ examples: ['false', 'true'] })
  monthlyStats: boolean;

  @Column({
    type: 'boolean',
    default: true
  })
  promotional: boolean;
}
