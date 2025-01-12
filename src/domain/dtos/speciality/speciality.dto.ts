import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayUnique,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested
} from 'class-validator';
import { FullBaseDto, ShortBaseDto } from '../../../common/dtos';

export class CreateSpecialityDto {
  
  @IsString()
  @ApiProperty({ example: 'Medicina Clínica' })
  name: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ example: true })
  canPrescribe?: boolean;

  @ArrayUnique()
  @IsOptional()
  @ValidateNested()
  @Type(() => ShortBaseDto)
  tags?: ShortBaseDto[];
}

export class UpdateSpecialityDto extends PartialType(CreateSpecialityDto) {
  @ArrayUnique()
  @ValidateNested()
  @Type(() => ShortBaseDto)
  tags?: ShortBaseDto[];
}
