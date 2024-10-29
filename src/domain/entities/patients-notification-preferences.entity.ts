import { Column, Entity } from 'typeorm';
import { NotificationPreferences } from './notification-preferences-abstract.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('patients_notifications_preferences')
export class PatientsNotificationPreferences extends NotificationPreferences {
  @Column({
    type: 'boolean',
    name: 'medicine_time',
    default: true
  })
  @ApiProperty({ examples: ['false', 'true'] })
  medicineTime: boolean;

  @Column({
    type: 'boolean',
    default: true
  })
  promotional: boolean;
}
