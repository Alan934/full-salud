import { OmitType, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  ValidateIf,
  ValidateNested
} from 'class-validator';
import { ShortBaseDto } from 'src/common/dtos';
import { CreateIndicationDto } from '..';

export class CreatePrescriptionDto {
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  date: Date;

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
