import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { SerializerProfessionalDegreeDto, SerializerShortPractitionerRoleDto, SerializerLocationDto, ShortSerializerPractitionerAppointmentDto, SerializerAppointmentDto } from '..';
import { SerializerUserDto } from '../user/user-serializer.dto';
import { ShortBaseDto } from '../../../common/dtos';
import { PractitionerSocialWorkSerializerDto } from '../practitioner-social-work/practitioner-social-work-serializer.dto';

export class SerializerPractitionerDto extends SerializerUserDto {
  @Expose()
  @ApiProperty({ example: 'Practitioner' })
  resourceType?: string = 'Practitioner';

  @Expose()
  @ApiProperty({ example: '123456-M-BA' })
  license: string;

  @Expose()
  @Type(() => SerializerProfessionalDegreeDto)
  professionalDegree: SerializerProfessionalDegreeDto;

  @Expose()
  @ApiProperty({ example: 'false' })
  homeService: boolean;

  @Expose()
  @ApiProperty({ example: 30 })
  durationAppointment?: number;

  @Expose()
  @ApiProperty({ example: 'false' })
  acceptedSocialWorks: boolean;

  @Expose()
  @Type(() => SerializerShortPractitionerRoleDto)
  practitionerRole: SerializerShortPractitionerRoleDto[];

  @Expose()
  @Type(() => ShortSerializerPractitionerAppointmentDto)
  practitionerAppointment: ShortSerializerPractitionerAppointmentDto[];

  @Expose()
  @Type(() => SerializerAppointmentDto)
  turns: SerializerAppointmentDto[];

  @Expose()
  @Type(() => PractitionerSocialWorkSerializerDto)
  practitionerSocialWorks?: PractitionerSocialWorkSerializerDto[];

}

export class ShortSerializerPractitionerDto extends SerializerUserDto {

}

export class SerializerShortPractitionerDto extends ShortBaseDto {
  @Expose()
  @Type(() => SerializerShortPractitionerRoleDto)
  practitionerRole: SerializerShortPractitionerRoleDto[];
}