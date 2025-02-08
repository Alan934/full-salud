import { FullBaseDto } from '../../../common/dtos';
import {
  SerializerOfficeDto,
  SerializerPractitionerDto,
  SerializerShortOfficeDto,
  SerializerShortPractitionerDto,
} from '../../../domain/dtos';
import { Expose, Type } from 'class-transformer';
import { OmitType } from '@nestjs/swagger';

export class SerializerSpecialistSecretaryDto extends FullBaseDto {
  @Expose()
  @Type(() => SerializerPractitionerDto)
  person: SerializerPractitionerDto;

  @Expose()
  @Type(() => SerializerOfficeDto)
  office: SerializerOfficeDto;
}

export class SerializerShortSpecialistSecretaryDto extends OmitType(
  FullBaseDto,
  ['createdAt', 'deletedAt'] as const
) {
  @Expose()
  @Type(() => SerializerShortPractitionerDto)
  person: SerializerShortPractitionerDto;

  @Expose()
  @Type(() => SerializerShortOfficeDto)
  office: SerializerShortOfficeDto;
}
