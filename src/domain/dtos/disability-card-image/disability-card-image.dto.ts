import { PartialType } from '@nestjs/swagger';
import { ShortBaseDto } from 'src/common/dtos';
import { IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateImageBaseDto } from '..';

export class CreateDisabilityCardImageDto extends CreateImageBaseDto {
  //recibe el id del paciente al que pertenece la card
  @IsOptional()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ShortBaseDto)
  patientTurn?: ShortBaseDto;
}

export class UpdateDisabilityCardImageDto extends PartialType(
  CreateDisabilityCardImageDto
) {}
