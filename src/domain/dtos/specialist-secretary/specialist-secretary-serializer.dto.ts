import { FullBaseDto } from '../../../common/dtos';
import {
  SerializerFullPersonDto,
  SerializerShortPersonDto,
  SerializerOfficeDto,
  SerializerShortOfficeDto
} from '../../../domain/dtos';
import { Expose, Type } from 'class-transformer';
import { OmitType } from '@nestjs/swagger';

export class SerializerSpecialistSecretaryDto extends FullBaseDto {
  @Expose()
  @Type(() => SerializerFullPersonDto)
  person: SerializerFullPersonDto;

  @Expose()
  @Type(() => SerializerOfficeDto)
  office: SerializerOfficeDto;
}

export class SerializerShortSpecialistSecretaryDto extends OmitType(
  FullBaseDto,
  ['createdAt', 'deletedAt'] as const
) {
  @Expose()
  @Type(() => SerializerShortPersonDto)
  person: SerializerShortPersonDto;

  @Expose()
  @Type(() => SerializerShortOfficeDto)
  office: SerializerShortOfficeDto;
}
