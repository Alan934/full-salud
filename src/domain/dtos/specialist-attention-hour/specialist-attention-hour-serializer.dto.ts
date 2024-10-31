import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { FullBaseDto, ShortBaseDto } from '../../../common/dtos';
import { Day } from '../../../domain/enums';
import { SerializerOfficeDto, SerializerShortOfficeDto } from '../../../domain/dtos';

export class ShortSerializerSpecialistAttentionHourDto extends ShortBaseDto {
  @Expose()
  @ApiProperty({ example: '09:00' })
  startHour: string;

  @Expose()
  @ApiProperty({ example: '13:00' })
  endHour: string;

  @Expose()
  @ApiProperty({ example: 'Sunday' })
  day: Day;

  @Expose()
  @Type(() => SerializerShortOfficeDto)
  office: SerializerShortOfficeDto;
}

export class SerializerSpecialistAttentionHourDto extends FullBaseDto {
  @Expose()
  @ApiProperty({ example: '2024-09-13T09:00:00Z' })
  startHour: string;

  @Expose()
  @ApiProperty({ example: '2024-09-13T09:00:00Z' })
  endHour: string;

  @Expose()
  @ApiProperty({ example: 'Sunday' })
  day: Day;

  @Expose()
  @Type(() => SerializerOfficeDto)
  office: SerializerOfficeDto;
}
