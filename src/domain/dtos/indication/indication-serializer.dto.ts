import { Exclude, Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { FullBaseDto, ShortBaseDto } from '../../../common/dtos';
import {
  SerializerMedicationDto,
  SerializerShortPrescriptionDto,
  SerializerIndicationDetailDto
} from '..';

export class SerializerIndicationDto extends FullBaseDto {
  @Expose()
  @ApiProperty({ example: '2024-09-12' })
  start: string;

  // @Expose()
  // @Type(() => SerializerMedicineDto)
  // medicine: SerializerMedicineDto;

  @Expose()
  @Type(() => SerializerIndicationDetailDto)
  indicationsDetails: SerializerIndicationDetailDto[];

  @Exclude()
  @Type(() => SerializerShortPrescriptionDto)
  prescription: SerializerShortPrescriptionDto;
}

export class SerializerShortIndicationDto extends ShortBaseDto {
  @Expose()
  start: string;

  @Expose()
  @Type(() => SerializerMedicationDto)
  medicine: SerializerMedicationDto;
}
