import { OmitType, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested
} from 'class-validator';
import { ShortBaseDto } from '../../../common/dtos';
import { CreateIndicationDto } from '..';

export class CreatePrescriptionDto {
  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  date: string;

  //recibe el id del paciente
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ShortBaseDto)
  patientTurn: ShortBaseDto;

  //recibe el id del especialista
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ShortBaseDto)
  specialist: ShortBaseDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateIndicationDto)
  indications?: CreateIndicationDto[];

  @IsNotEmpty()
  @ValidateIf((dto) => !dto.indications || dto.observations) //si indications no está presente, observations es obligatoria
  observations?: string;
}

export class UpdatePrescriptionDto extends PartialType(
  OmitType(CreatePrescriptionDto, ['patientTurn', 'specialist', 'indications'])
) {}
