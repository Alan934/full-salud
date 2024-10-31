import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { ShortBaseDto } from '../../../common/dtos';
import {
  SerializerDisabilityCardImageDto,
  SerializerShortPacientTurnDto
} from '..';

export class SerializerDisabilityCardDto extends ShortBaseDto {
  @Expose()
  @ApiProperty({ example: '123456789' })
  cardNumber: string;

  @Expose()
  @ApiProperty({ example: '2024-12-31T23:59:59Z' })
  expirationDate: Date;

  // Expone el campo patientTurns en la salida serializada como un array de SerializerPatientTurnDto
  @Exclude()
  @Type(() => SerializerShortPacientTurnDto)
  patientTurn?: SerializerShortPacientTurnDto;

  @Expose()
  @Type(() => SerializerDisabilityCardImageDto)
  @ApiProperty({ type: [SerializerDisabilityCardImageDto] })
  disabilityCardImages: SerializerDisabilityCardImageDto[];
}

export class SerializerShortDisabilityCardDto extends ShortBaseDto {
  @Expose()
  @ApiProperty({ example: '123456789' })
  cardNumber: string;

  @Expose()
  @ApiProperty({ example: '2024-12-31T23:59:59Z' })
  expirationDate: Date;

  @Expose()
  @Type(() => SerializerDisabilityCardImageDto)
  disabilityCardImage: SerializerDisabilityCardImageDto;
}
