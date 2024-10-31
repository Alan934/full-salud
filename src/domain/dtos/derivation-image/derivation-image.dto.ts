import { PartialType } from '@nestjs/swagger';
import { CreateImageBaseDto } from '..';
import { ShortBaseDto } from '../../../common/dtos';
import { IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateDerivationImageDto extends CreateImageBaseDto {
  //recibe el id del turno en el que se creo la derivación
  @IsOptional()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ShortBaseDto)
  turn?: ShortBaseDto;
}

export class UpdateDerivationImageDto extends PartialType(
  CreateDerivationImageDto
) {}
