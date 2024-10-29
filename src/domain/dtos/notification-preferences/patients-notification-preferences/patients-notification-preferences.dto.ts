import { IsBoolean, IsOptional } from 'class-validator';
import { UpdateNotificationPreferencesDto } from '../notification-preferences.dto';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePatientsNotificationsPreferencesDto extends UpdateNotificationPreferencesDto {
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  @ApiProperty({ examples: ['false', 'true'] })
  medicineTime?: boolean;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  @ApiProperty({ examples: ['false', 'true'] })
  promotional?: boolean;
}
