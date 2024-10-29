import { Expose } from 'class-transformer';
import { SerializerNotificationPreferencesDto } from '../notification-preferences-serializer.dto';
import { ApiProperty, OmitType } from '@nestjs/swagger';

export class SerializerSecretaryNotificationPreferencesDto extends SerializerNotificationPreferencesDto {
  @Expose()
  @ApiProperty({ examples: ['false', 'true'] })
  applications: boolean;

  @Expose()
  @ApiProperty({ examples: ['false', 'true'] })
  dailyPatientsList: boolean;

  @Expose()
  @ApiProperty({ examples: ['false', 'true'] })
  turnRequests: boolean;

  @Expose()
  @ApiProperty({ examples: ['false', 'true'] })
  derivationRequests: boolean;

  @Expose()
  @ApiProperty({ examples: ['false', 'true'] })
  cancelledTurns: boolean;

  @Expose()
  @ApiProperty({ examples: ['false', 'true'] })
  commissions: boolean;
}

export class SerializerShortSecretaryNotificationPreferencesDto extends OmitType(
  SerializerSecretaryNotificationPreferencesDto,
  ['createdAt', 'deletedAt', 'user'] as const
) {}
