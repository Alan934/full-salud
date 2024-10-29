import { Expose } from 'class-transformer';
import { SerializerMedicalProviderNotificationPreferencesDto } from '../notification-preferences-serializer.dto';
import { ApiProperty, OmitType } from '@nestjs/swagger';

export class SerializerInstitutionsNotificationPreferencesDto extends SerializerMedicalProviderNotificationPreferencesDto {
  @Expose()
  @ApiProperty({ examples: ['false', 'true'] })
  derivationRequests: boolean;
}

export class SerializerShortInstitutionsNotificationPreferencesDto extends OmitType(
  SerializerInstitutionsNotificationPreferencesDto,
  ['createdAt', 'deletedAt', 'user'] as const
) {}
