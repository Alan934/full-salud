import { ApiProperty } from '@nestjs/swagger';
import { FullBaseDto, ShortBaseDto } from '../../../common/dtos';
import {
  // SerializerFullPersonDto,
  SerializerDegreeDto,
  // SerializerShortPersonDto,
  SerializerShortSpecialityDto,
  SerializerShortSocialWorkDto,
  ShortSerializerSpecialistAttentionHourDto,
  SerializerTurnDto,
  SerializerShortUserDto
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
  @Type(() => SerializerShortUserDto)
  user: SerializerShortUserDto;

  @Expose()
  @Type(() => SerializerShortSpecialityDto)
  specialities: SerializerShortSpecialityDto[];
  @Expose()
  @Type(() => SerializerShortSocialWorkDto)
  acceptedSocialWorks: SerializerShortSocialWorkDto[];

  @Expose()
  @Type(() => ShortSerializerSpecialistAttentionHourDto)
  specialistAttentionHour: ShortSerializerSpecialistAttentionHourDto[];

  @Expose()
  @Type(() => SerializerTurnDto)
  turns: SerializerTurnDto[];
}

export class SerializerShortSpecialistDto extends ShortBaseDto {
  @Expose()
  @Type(() => SerializerShortSpecialityDto)
  specialities: SerializerShortSpecialityDto[];
}
