import {
  ArrayUnique,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested
} from 'class-validator';
import {
  CreatePersonDto,
  CreateSpecialistAttentionHourDto,
  UpdatePersonDto
} from '..';
import { Type } from 'class-transformer';
import { ShortBaseDto } from '../../../common/dtos';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';

export class CreateSpecialistDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: '123456-M-BA' })
  license: string;

  //recibe el id de un degree elegido
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ShortBaseDto)
  degree: ShortBaseDto;

  //recibe un array con los id de las especialidades
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ShortBaseDto)
  speciality: ShortBaseDto;

  //recibe un array con los id de las obras sociales que acepta
  @IsOptional()
  @ArrayUnique()
  @ValidateNested()
  @Type(() => ShortBaseDto)
  acceptedSocialWorks?: ShortBaseDto[];

  //recibe un create dto de person
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreatePersonDto)
  person: CreatePersonDto;

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
  OmitType(CreateSpecialistDto, ['person'] as const)
) {
  //recibe un update dto de person
  @IsOptional()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => UpdatePersonDto)
  person?: UpdatePersonDto;

  @IsOptional()
  @ArrayUnique()
  @ValidateNested()
  @Type(() => ShortBaseDto)
  acceptedSocialWorks?: ShortBaseDto[];
}
