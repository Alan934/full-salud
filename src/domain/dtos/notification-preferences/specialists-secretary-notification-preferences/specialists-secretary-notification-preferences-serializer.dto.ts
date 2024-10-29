import { ApiProperty, OmitType } from '@nestjs/swagger';
import { SerializerMedicalProviderNotificationPreferencesDto } from '../notification-preferences-serializer.dto';
import { Expose } from 'class-transformer';

export class SerializerSpecialistsSecretaryNotificationPreferencesDto extends SerializerMedicalProviderNotificationPreferencesDto {
  @Expose()
  @ApiProperty({ examples: ['false', 'true'] })
  turnRequests: boolean;
}

export class SerializerShortSpecialistsSecretaryNotificationPreferencesDto extends OmitType(
  SerializerSpecialistsSecretaryNotificationPreferencesDto,
  ['createdAt', 'deletedAt', 'user'] as const
) {}
