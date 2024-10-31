import { ApiProperty } from '@nestjs/swagger';
import { FullBaseDto, ShortBaseDto } from '../../../common/dtos';
import {
  SerializerFullPersonDto,
  SerializerDegreeDto,
  SerializerShortPersonDto,
  SerializerShortSpecialityDto,
  SerializerShortSocialWorkDto,
  ShortSerializerSpecialistAttentionHourDto
} from '..';
import { Expose, Type } from 'class-transformer';

export class SerializerSpecialistDto extends FullBaseDto {
  @Expose()
  @ApiProperty({ example: '123456-M-BA' })
  license: string;

  @Expose()
  @Type(() => SerializerDegreeDto)
  degree: SerializerDegreeDto;

  @Expose()
  @ApiProperty({ example: 'false' })
  homeService: boolean;

  @Expose()
  @Type(() => SerializerShortSpecialityDto)
  speciality: SerializerShortSpecialityDto;

  @Expose()
  @Type(() => SerializerShortSocialWorkDto)
  acceptedSocialWorks: SerializerShortSocialWorkDto[];

  @Expose()
  @Type(() => SerializerFullPersonDto)
  person: SerializerFullPersonDto;

  @Expose()
  @Type(() => ShortSerializerSpecialistAttentionHourDto)
  specialistAttentionHour: ShortSerializerSpecialistAttentionHourDto[];
}

export class SerializerShortSpecialistDto extends ShortBaseDto {
  @Expose()
  @Type(() => SerializerShortPersonDto)
  person: SerializerShortPersonDto;

  @Expose()
  @Type(() => SerializerShortSpecialityDto)
  speciality: SerializerShortSpecialityDto;
}
