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
  UpdateSpecialityDto,
} from '..';
import { Type } from 'class-transformer';
import { ShortBaseDto } from '../../../common/dtos';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { PersonBaseDto } from '../person/person.dto';
import { Speciality } from 'src/domain/entities';

export class CreateSpecialistDto extends PersonBaseDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: '123456-M-BA' })
  license: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ShortBaseDto)
  degree: ShortBaseDto;

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
export class UpdateSpecialistDto extends PartialType((CreateSpecialistDto)) {

  @IsOptional()
  @ArrayUnique()
  @ValidateNested()
  @Type(() => ShortBaseDto)
  acceptedSocialWorks?: ShortBaseDto[];
}