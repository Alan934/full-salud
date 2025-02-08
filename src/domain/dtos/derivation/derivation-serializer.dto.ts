import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { FullBaseDto, ShortBaseDto } from '../../../common/dtos';
import { SerializerShortPacientTurnDto } from '../patient-turn/patient-turn-serializer.dto';
import { SerializerShortPractitionerDto } from '../practitioner/Practitioner-serializer.dto';
export class SerializerDerivationDto extends FullBaseDto {
  @Expose()
  @ApiProperty({ example: '2024-12-31T23:59:59Z' })
  date: string;

  @Expose()
  @ApiProperty({ example: 'Detalles de la derivación' })
  details: string;

  @Expose()
  @ApiProperty({ example: 'Cardiología' })
  specialityt: string;

  @Expose()
  @Type(() => SerializerShortPacientTurnDto)
  @ApiProperty({ type: () => SerializerShortPacientTurnDto })
  patientTurn: SerializerShortPacientTurnDto;

  @Expose()
  @Type(() => SerializerShortPractitionerDto)
  @ApiProperty({ type: () => SerializerShortPractitionerDto })
  practitioner: SerializerShortPractitionerDto;
}

export class ShortDerivationDto extends ShortBaseDto {
  @Expose()
  @ApiProperty({ example: '2024-12-31T23:59:59Z' })
  date: string;

  @Expose()
  @ApiProperty({ example: 'Cardiología' })
  speciality: string;
}
