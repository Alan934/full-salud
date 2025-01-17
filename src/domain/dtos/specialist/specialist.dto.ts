import {
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import {
  CreateSpecialistAttentionHourDto,
  UpdateSpecialistAttentionHourDto,
} from '..';
import { Type } from 'class-transformer';
import { ShortBaseDto } from '../../../common/dtos';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { UserDto } from '../user/user.dto';

export class CreateSpecialistDto extends OmitType(UserDto, ['role'] as const) {
  @IsOptional()
  @IsString()
  @ApiProperty({ example: '123456-M-BA' })
  license?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'f0d50580-e7ca-4860-ba4e-7c4809153ae7' })
  degreeId?: string;

  @ValidateNested({ each: true })
  @Type(() => ShortBaseDto)
  @IsOptional()
  @ApiProperty({ type: [ShortBaseDto] })
  specialities?: ShortBaseDto[];

  @ValidateNested({ each: true })
  @Type(() => ShortBaseDto)
  @IsOptional()
  @ApiProperty({ type: [ShortBaseDto] })
  acceptedSocialWorks?: ShortBaseDto[];

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ example: false })
  homeService?: boolean;

  @ValidateNested({ each: true })
  @Type(() => CreateSpecialistAttentionHourDto)
  @IsOptional()
  @ApiProperty({ type: [CreateSpecialistAttentionHourDto] })
  specialistAttentionHour?: CreateSpecialistAttentionHourDto[];
}

export class UpdateSpecialistDto extends PartialType(OmitType(CreateSpecialistDto, ['specialistAttentionHour'])) {
  @ValidateNested({ each: true })
  @Type(() => UpdateSpecialistAttentionHourDto)
  @IsOptional()
  @ApiProperty({ type: [UpdateSpecialistAttentionHourDto] })
  specialistAttentionHour?: UpdateSpecialistAttentionHourDto[];
}
