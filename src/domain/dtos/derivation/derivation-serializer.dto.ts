import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { FullBaseDto, ShortBaseDto } from 'src/common/dtos';
import { SerializerShortPacientTurnDto } from '../patient-turn/patient-turn-serializer.dto';
import { SerializerSpecialistDto } from '../specialist/specialist-serializer.dto';

export class SerializerDerivationDto extends FullBaseDto {
  @Expose()
  @ApiProperty({ example: '2024-12-31T23:59:59Z' })
  date: Date;

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
  @Type(() => SerializerSpecialistDto)
  @ApiProperty({ type: () => SerializerSpecialistDto })
  specialist: SerializerSpecialistDto;
}

export class ShortDerivationDto extends ShortBaseDto {
  @Expose()
  @ApiProperty({ example: '2024-12-31T23:59:59Z' })
  date: Date;

  @Expose()
  @ApiProperty({ example: 'Cardiología' })
  speciality: string;
}
