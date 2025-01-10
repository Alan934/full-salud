import {
  IsNotEmpty,
  ValidateNested,
  IsOptional,
  IsString
} from 'class-validator';
import { Type } from 'class-transformer';
import { ShortBaseDto } from '../../../common/dtos';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateIndicationDetailDto } from '../indication-detail/indication-detail.dto';

export class CreateIndicationDto {
  @IsOptional()
  @IsString()
  @Type(() => String)
  @ApiProperty({ example: '2024-12-07' })
  start?: string;

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
