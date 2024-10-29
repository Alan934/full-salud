import { IsBoolean, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateMedicalProviderNotificationPreferencesDto } from '../notification-preferences.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateInstitutionsNotificationPreferencesDto extends UpdateMedicalProviderNotificationPreferencesDto {
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  @ApiProperty({ examples: ['false', 'true'] })
  derivationRequests?: boolean;
}
