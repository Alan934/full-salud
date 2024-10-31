import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayUnique,
  IsBoolean,
  IsNotEmpty,
  IsString,
  ValidateNested
} from 'class-validator';
import { ShortBaseDto } from '../../../common/dtos';

export class CreateSpecialityDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Medicina Clínica' })
  name: string;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({ example: true })
  canPrescribe: boolean;

  @ArrayUnique()
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
