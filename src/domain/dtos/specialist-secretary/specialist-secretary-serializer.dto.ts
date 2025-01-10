import { FullBaseDto } from '../../../common/dtos';
import {
  SerializerOfficeDto,
  SerializerShortOfficeDto,
  SerializerShortSpecialistDto,
  SerializerSpecialistDto,
} from '../../../domain/dtos';
import { Expose, Type } from 'class-transformer';
import { OmitType } from '@nestjs/swagger';

export class SerializerSpecialistSecretaryDto extends FullBaseDto {
  @Expose()
  @Type(() => SerializerSpecialistDto)
  person: SerializerSpecialistDto;

  @Expose()
  @Type(() => SerializerOfficeDto)
  office: SerializerOfficeDto;
}

export class SerializerShortSpecialistSecretaryDto extends OmitType(
  FullBaseDto,
  ['createdAt', 'deletedAt'] as const
) {
  @Expose()
  @Type(() => SerializerShortSpecialistDto)
  person: SerializerShortSpecialistDto;

  @Expose()
  @Type(() => SerializerShortOfficeDto)
  office: SerializerShortOfficeDto;
}
