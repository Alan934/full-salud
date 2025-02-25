import { Expose, Type } from 'class-transformer';
import { ShortBaseDto } from '../../../common/dtos';
import { SerializerShortSocialWorkDto } from '../social-work/SocialWork-serializer.dto';
import { ApiProperty } from '@nestjs/swagger';
import { SerializerShortPractitionerRoleDto } from '../practitioner-role/PractitionerRole-serializer.dto';

export class SerializerPaymentDto extends ShortBaseDto {
  @ApiProperty({ example: '30' })
  @Expose()
  paymentTime: number;

  @Expose()
  @Type(() => SerializerShortSocialWorkDto)
  socialWork: SerializerShortSocialWorkDto;

  @Expose()
  @Type(() => SerializerShortPractitionerRoleDto)
  speciality: SerializerShortPractitionerRoleDto;
}
