import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { FullBaseDto, ShortBaseDto } from 'src/common/dtos';
import { SerializerInstitutionTypeDto, SerializerIvaDto } from '..';

export class SerializerInstitutionDto extends FullBaseDto {
  @Expose()
  @ApiProperty({ example: '30701234567' })
  cuit: string;

  @Expose()
  @ApiProperty({ example: 'Centro Médico' })
  businessName: string;

  @Expose()
  @Type(() => SerializerIvaDto)
  iva: SerializerIvaDto;

  @Expose()
  @Type(() => SerializerInstitutionTypeDto)
  institutionType: SerializerInstitutionTypeDto;
}

export class SerializerShortInstitutionDto extends ShortBaseDto {
  @Expose()
  @ApiProperty({ example: 'Centro Médico' })
  businessName: string;

  @Expose()
  @Type(() => SerializerInstitutionTypeDto)
  institutionType: SerializerInstitutionTypeDto;
}
