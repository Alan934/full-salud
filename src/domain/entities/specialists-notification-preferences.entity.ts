import { Column, Entity } from 'typeorm';
import { MedicalProviderNotificationPreferences } from './notification-preferences-abstract.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('specialists_notifications_preferences')
export class SpecialistsNotificationPreferences extends MedicalProviderNotificationPreferences {
  @Column({
    type: 'boolean',
    name: 'turn_requests',
    default: true
  })
  @ApiProperty({ examples: ['false', 'true'] })
  turnRequests: boolean;
}
