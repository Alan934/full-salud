import { ApiProperty } from '@nestjs/swagger';
import { FullBaseDto } from 'src/common/dtos';
import { SerializerShortSpecialistDto, SerializerShortPracticeDto } from '..';
import { Expose, Type } from 'class-transformer';

export class SerializerPriceDto extends FullBaseDto {
  @Expose()
  @ApiProperty({ example: '8000' })
  price: number;

  @Expose()
  @Type(() => SerializerShortSpecialistDto)
  specialist: SerializerShortSpecialistDto;

  @Expose()
  @Type(() => SerializerShortPracticeDto)
  practice: SerializerShortPracticeDto;
}
