import { ApiProperty, OmitType } from '@nestjs/swagger';
import { SerializerMedicalProviderNotificationPreferencesDto } from '../notification-preferences-serializer.dto';
import { Expose } from 'class-transformer';

export class SerializerSpecialistsNotificationPreferencesDto extends SerializerMedicalProviderNotificationPreferencesDto {
  @Expose()
  @ApiProperty({ examples: ['false', 'true'] })
  turnRequests: boolean;
}

export class SerializerShortSpecialistsNotificationPreferencesDto extends OmitType(
  SerializerSpecialistsNotificationPreferencesDto,
  ['createdAt', 'deletedAt', 'user'] as const
) {}
