import {
  IsDate,
  IsNotEmpty,
  ValidateNested,
  IsOptional
} from 'class-validator';
import { Type } from 'class-transformer';
import { ShortBaseDto } from 'src/common/dtos';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateIndicationDetailDto } from '../indication-detail/indication-detail.dto';

export class CreateIndicationDto {
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @ApiProperty({ example: '2024-12-07' })
  start?: Date;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ShortBaseDto)
  @ApiProperty({ description: 'Medicina que se receta.' })
  medicine: ShortBaseDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateIndicationDetailDto)
  @ApiProperty({ description: 'Detalles de las indicaciones' })
  indicationsDetails?: CreateIndicationDetailDto[];
}

export class UpdateIndicationDto extends PartialType(CreateIndicationDto) {}
