import { Expose } from 'class-transformer';
import { SerializerNotificationPreferencesDto } from '../notification-preferences-serializer.dto';
import { ApiProperty, OmitType } from '@nestjs/swagger';

export class SerializerPatientsNotificationPreferencesDto extends SerializerNotificationPreferencesDto {
  @Expose()
  @ApiProperty({ examples: ['false', 'true'] })
  medicineTime: boolean;

  @Expose()
  @ApiProperty({ examples: ['false', 'true'] })
  promotional: boolean;
}

export class SerializerShortPatientsNotificationPreferencesDto extends OmitType(
  SerializerPatientsNotificationPreferencesDto,
  ['createdAt', 'user', 'deletedAt'] as const
) {}
