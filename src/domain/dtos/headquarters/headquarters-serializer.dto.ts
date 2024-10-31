import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { FullBaseDto, ShortBaseDto } from '../../../common/dtos';
import {
  SerializerUserDto,
  SerializerShortInstitutionDto,
  SerializerShortAddressDto,
  SerializerAttentionHourDto
} from '..';

export class SerializerHeadquartersDto extends FullBaseDto {
  @Expose()
  @ApiProperty({ example: '30701234567' })
  cuit: string;

  @Expose()
  @ApiProperty({ example: 'Centro Médico' })
  businessName: string;

  @Expose()
  @ApiProperty({ example: '123456789' })
  phone: string;

  @Expose()
  @Type(() => SerializerUserDto)
  user: SerializerUserDto;

  @Expose()
  @Type(() => SerializerShortInstitutionDto)
  institution: SerializerShortInstitutionDto;

  @Expose()
  @Type(() => SerializerShortAddressDto)
  address: SerializerShortAddressDto;

  @Expose()
  @Type(() => SerializerAttentionHourDto)
  attentionHours: SerializerAttentionHourDto[];
}

export class SerializerShortHeadquartersDto extends ShortBaseDto {
  @Expose()
  @ApiProperty({ example: 'Centro Médico' })
  businessName: string;
}
