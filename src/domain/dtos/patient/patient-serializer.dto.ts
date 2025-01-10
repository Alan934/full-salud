import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import {
  SerializerPatientTurnDto,
  SerializerRelationshipDto,
  SerializerShortAddressDto,
  SerializerShortUserDto
} from '..';

export class SerializerPatientDto {
  @Expose()
  @ApiProperty({ example: '2615836294' })
  phone: string;

  @Expose()
  @Type(() => SerializerShortUserDto)
  user: SerializerShortUserDto;

  @Expose()
  @Type(() => SerializerPatientTurnDto)
  patientTurn: SerializerPatientTurnDto;

  @Expose()
  @Type(() => SerializerRelationshipDto)
  relationship: SerializerRelationshipDto;

  @Expose()
  @Type(() => SerializerShortAddressDto)
  addresses: SerializerShortAddressDto[];
}

export class SerializerShortPatientDto extends SerializerPatientDto {
  @Exclude()
  @Type(() => SerializerShortAddressDto)
  addresses: SerializerShortAddressDto[];
}
