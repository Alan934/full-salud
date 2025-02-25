import { Expose } from 'class-transformer';
import { SerializerMedicalProviderNotificationPreferenceDto } from '../NotificationPreference-serializer.dto';
import { ApiProperty, OmitType } from '@nestjs/swagger';

export class SerializerOrganizationNotificationPreferenceDto extends SerializerMedicalProviderNotificationPreferenceDto {
  @Expose()
  @ApiProperty({ examples: ['false', 'true'] })
  derivationRequests: boolean;
}

export class SerializerShortOrganizationNotificationPreferenceDto extends OmitType(
  SerializerOrganizationNotificationPreferenceDto,
  ['createdAt', 'deletedAt', 'user'] as const
) {}
