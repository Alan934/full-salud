import { FullBaseDto } from 'src/common/dtos';
import { SerializerShortAddressDto } from 'src/domain/dtos';
import { Expose, Type } from 'class-transformer';
import { ApiProperty, OmitType } from '@nestjs/swagger';

export class SerializerOfficeDto extends FullBaseDto {
  @Expose()
  @ApiProperty({
    example: 'Consultorio del Parque'
  })
  name: string;

  @Expose()
  @ApiProperty({
    example: '2615623164'
  })
  phone?: string;

  @Expose()
  @Type(() => SerializerShortAddressDto)
  address: SerializerShortAddressDto;
}

export class SerializerShortOfficeDto extends OmitType(SerializerOfficeDto, [
  'createdAt',
  'deletedAt',
  'address'
] as const) {}
