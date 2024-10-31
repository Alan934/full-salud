import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { Media } from '../../enums/media.enum';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';
import { ShortBaseDto } from '../../../common/dtos/base-short.dto';

export class CreateNotificationPreferencesDto {
  constructor(media: Media, user: ShortBaseDto) {
    this.media = media;
    this.user = user;
  }

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @ApiProperty({ examples: ['2024-08-27T08:30:00'] })
  startHour?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @ApiProperty({ examples: ['2024-08-27T12:30:00'] })
  endHour?: Date;

  @IsNotEmpty()
  @IsEnum(Media)
  @ApiProperty({ examples: [Media.EMAIL, Media.WHATSAPP] })
  media: Media;

  @IsNotEmpty()
  @IsUUID()
  @ValidateNested()
  @Type(() => ShortBaseDto)
  user: ShortBaseDto;
}

//permite actualizar el rango de horarios pero no el medio, ni el usuario
export abstract class UpdateNotificationPreferencesDto extends PartialType(
  OmitType(CreateNotificationPreferencesDto, ['media', 'user'] as const)
) {}

export abstract class UpdateMedicalProviderNotificationPreferencesDto extends UpdateNotificationPreferencesDto {
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  @ApiProperty({ examples: ['false', 'true'] })
  weeklyPatientsList?: boolean;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  @ApiProperty({ examples: ['false', 'true'] })
  cancelledTurns?: boolean;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  @ApiProperty({ examples: ['false', 'true'] })
  monthlyStats?: boolean;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  @ApiProperty({ examples: ['false', 'true'] })
  promotional?: boolean;
}
