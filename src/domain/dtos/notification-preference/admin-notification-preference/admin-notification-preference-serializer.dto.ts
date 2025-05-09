import { Expose } from 'class-transformer';
import { SerializerNotificationPreferenceDto } from '../notification-preference-serializer.dto';
import { ApiProperty, OmitType } from '@nestjs/swagger';

export class SerializerAdminNotificationPreferenceDto extends SerializerNotificationPreferenceDto {
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

export class SerializerShortAdminNotificationPreferenceDto extends OmitType(
  SerializerAdminNotificationPreferenceDto,
  ['createdAt', 'deletedAt', 'user'] as const
) {}
