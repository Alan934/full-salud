import { Column, Entity } from 'typeorm';
import { MedicalProviderNotificationPreferences } from './notification-preferences-abstract.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('institutions_notifications_preferences')
export class InstitutionsNotificationPreferences extends MedicalProviderNotificationPreferences {
  @Column({
    type: 'boolean',
    name: 'derivation_requests',
    default: true
  })
  @ApiProperty({ examples: ['false', 'true'] })
  derivationRequests: boolean;
}
