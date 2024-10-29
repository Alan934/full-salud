import { FullBaseDto } from 'src/common/dtos';
import {
  SerializerShortSpecialistDto,
  SerializerShortPacientTurnDto,
  SerializerIndicationDto
} from '..';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class SerializerPrescriptionDto extends FullBaseDto {
  @Expose()
  @ApiProperty({ example: '1970-12-07' })
  date: Date;

  @Expose()
  @Type(() => SerializerShortPacientTurnDto)
  patientTurn: SerializerShortPacientTurnDto;

  @Expose()
  @Type(() => SerializerShortSpecialistDto)
  specialist: SerializerShortSpecialistDto;

  @Expose()
  @Type(() => SerializerIndicationDto)
  indications: SerializerIndicationDto[];
}
export class SerializerShortPrescriptionDto extends FullBaseDto {
  @Expose()
  @ApiProperty({ example: '1970-12-07' })
  date: Date;

  @Expose()
  @Type(() => SerializerShortPacientTurnDto)
  patientTurn: SerializerShortPacientTurnDto;

  @Expose()
  @Type(() => SerializerShortSpecialistDto)
  specialist: SerializerShortSpecialistDto;
}
