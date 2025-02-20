import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { SerializerDegreeDto, SerializerShortPractitionerRoleDto, SerializerShortSocialWorkDto, ShortSerializerSpecialistAttentionHourDto, SerializerTurnDto } from '..';
import { SerializerUserDto } from '../user/user-serializer.dto';
import { ShortBaseDto } from '../../../common/dtos';

export class SerializerPractitionerDto extends SerializerUserDto {
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