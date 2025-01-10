import { FullBaseDto, ShortBaseDto } from '../../../common/dtos';
import {
  SerializerMemberSocialWorkDto,
  SerializerPatientDto,
  SerializerShortDisabilityCardDto
} from '..';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class SerializerPatientTurnDto extends FullBaseDto {
  @Expose()
  @Type(() => SerializerPatientDto)
  person: SerializerPatientDto;

  @Expose()
  @Type(() => SerializerMemberSocialWorkDto)
  memberSocialWork: SerializerMemberSocialWorkDto;

  @Expose()
  @ApiProperty({ examples: ['false', 'true'] })
  isDisabled: boolean;

  @Expose()
  @Type(() => SerializerShortDisabilityCardDto)
  disabilityCard?: SerializerShortDisabilityCardDto;
}

export class SerializerShortPacientTurnDto extends ShortBaseDto {
  @Expose()
  @ApiProperty({ examples: ['false', 'true'] })
  isDisabled: boolean;
}
