import { ApiProperty } from '@nestjs/swagger';
import { ShortBaseDto } from '../../../common/dtos';
import { Medication } from '../../entities';
import { Expose, Type } from 'class-transformer';
import { CreateMedicationDto } from '../medication/Medication.dto';
import { SerializerMedicationDto } from '../medication/Medication-serializer.dto';
import { SerializerUserDto } from '../user/user-serializer.dto';
import { SerializerPatientDto } from '../patient/patient-serializer.dto';
import { SerializerPractitionerDto } from '../practitioner/Practitioner-serializer.dto';

export class SerializerMedicationRequestDto extends ShortBaseDto {

  @Expose()
  @ApiProperty({ example: 'Tomar después de cada comida durante una semana' })
  indications: string;

  @Expose()
  @ApiProperty({ example: 'Faringitis aguda' })
  diagnosis: string;

  @Expose()
  @ApiProperty({ example: false })
  isValidSignature: boolean;

  @Expose()
  @Type(() => SerializerPractitionerDto)
  @ApiProperty({ type: [SerializerPractitionerDto] })
  practitioner: SerializerPractitionerDto;

  @Expose()
  @Type(() => SerializerPatientDto)
  @ApiProperty({ type: [SerializerPatientDto] })
  patient: SerializerPatientDto;

  @Expose()
  @Type(() => SerializerMedicationDto)
  @ApiProperty({ type: [SerializerMedicationDto] })
  medicines: SerializerMedicationDto[];
}
