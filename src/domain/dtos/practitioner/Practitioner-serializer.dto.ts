import { ApiProperty } from '@nestjs/swagger';
import { FullBaseDto, ShortBaseDto } from '../../../common/dtos';
import {
  // SerializerFullPersonDto,
  SerializerDegreeDto,
  // SerializerShortPersonDto,
  SerializerShortPractitionerRoleDto,
  SerializerShortSocialWorkDto,
  ShortSerializerSpecialistAttentionHourDto,
  SerializerTurnDto,
  SerializerShortUserDto
} from '..';
import { Expose, Type } from 'class-transformer';

export class SerializerPractitionerDto extends FullBaseDto {
  @Expose()
  @ApiProperty({ example: 'Practitioner' })
  resourceType?: string = 'Practitioner';
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
  @Type(() => SerializerShortPractitionerRoleDto)
  specialities: SerializerShortPractitionerRoleDto[];
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

export class SerializerShortPractitionerDto extends ShortBaseDto {
  @Expose()
  @Type(() => SerializerShortPractitionerRoleDto)
  specialities: SerializerShortPractitionerRoleDto[];
}
