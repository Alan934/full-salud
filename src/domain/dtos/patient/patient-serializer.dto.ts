import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import {
  SerializerPatientTurnDto,
  SerializerRelationshipDto,
  SerializerShortAddressDto,
  SerializerShortUserDto
} from '..';
import { FullBaseDto } from '../../../common/dtos';
import { IsOptional } from 'class-validator';

export class SerializerPatientDto extends FullBaseDto {

  @Expose()
  @ApiProperty({ example: 'Patient' }) 
  resourceType: string = 'Patient';

  @Expose()
  @ApiProperty({ example: 'Pepe' })
  name: string;

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
