import { IsBoolean, IsOptional } from 'class-validator';
import { UpdateMedicalProviderNotificationPreferencesDto } from '../notification-preferences.dto';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSpecialistsSecretaryNotificationPreferencesDto extends UpdateMedicalProviderNotificationPreferencesDto {
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  @ApiProperty({ examples: ['false', 'true'] })
  turnRequests?: boolean;
}
