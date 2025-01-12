import {
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested
} from 'class-validator';
import {
  CreateSpecialistAttentionHourDto,
  CreateSpecialityDto,
  UpdateSpecialistAttentionHourDto,
  UpdateSpecialityDto,
} from '..';
import { Type } from 'class-transformer';
import { ShortBaseDto } from '../../../common/dtos';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { PersonBaseDto } from '../person/person.dto';
import { Degree } from 'src/domain/entities';

export class CreateSpecialistDto extends PersonBaseDto {
  
  @IsOptional()
  @IsString()
  @ApiProperty({ example: '123456-M-BA' })
  license?: string;

  // @IsNotEmpty()
  // @ValidateNested()
  // @Type(() => ShortBaseDto)
  // degree: ShortBaseDto;
  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'f0d50580-e7ca-4860-ba4e-7c4809153ae7' })
  degreeId?: string;

  @ApiProperty({ type: [ShortBaseDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ShortBaseDto)
  specialities: ShortBaseDto[];

  @IsOptional()
  @ArrayUnique()
  @ValidateNested()
  @Type(() => ShortBaseDto)
  acceptedSocialWorks?: ShortBaseDto[];

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ example: 'false' })
  homeService?: boolean;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateSpecialistAttentionHourDto)
  specialistAttentionHour?: CreateSpecialistAttentionHourDto[];
}

//"reescribe" person
export class UpdateSpecialistDto extends PartialType(
  OmitType(CreateSpecialistDto, ['specialistAttentionHour', 'addresses'] as const),
) {
  @IsOptional()
  @ArrayUnique()
  @ValidateNested()
  @Type(() => ShortBaseDto)
  acceptedSocialWorks?: ShortBaseDto[];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdateSpecialistAttentionHourDto)
  specialistAttentionHour?: UpdateSpecialistAttentionHourDto[];
}