import { FullBaseDto } from '../../../common/dtos';
import {
  SerializerShortPacientTurnDto,
  SerializerIndicationDto,
  SerializerShortPractitionerDto
} from '..';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class SerializerPrescriptionDto extends FullBaseDto {
  @Expose()
  @ApiProperty({ example: '1970-12-07' })
  date: string;

  @Expose()
  @Type(() => SerializerShortPacientTurnDto)
  patientTurn: SerializerShortPacientTurnDto;

  @Expose()
  @Type(() => SerializerShortPractitionerDto)
  practitioner: SerializerShortPractitionerDto;

  @Expose()
  @Type(() => SerializerIndicationDto)
  indications: SerializerIndicationDto[];
}
export class SerializerShortPrescriptionDto extends FullBaseDto {
  @Expose()
  @ApiProperty({ example: '1970-12-07' })
  date: string;

  @Expose()
  @Type(() => SerializerShortPacientTurnDto)
  patientTurn: SerializerShortPacientTurnDto;

  @Expose()
  @Type(() => SerializerShortPractitionerDto)
  practitioner: SerializerShortPractitionerDto;
}
