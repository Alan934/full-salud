import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { FullBaseDto, ShortBaseDto } from '../../../common/dtos';
import { Day } from '../../../domain/enums';

export class SerializerAttentionHourPatientDto extends FullBaseDto {
  @Expose()
  @ApiProperty({ example: '09:00' })
  openingHour: string;

  @Expose()
  @ApiProperty({ example: '13:30' })
  closeHour: string;

  @Expose()
  @ApiProperty({
    example: Object.values(Day).join(', ')
  })
  day: Day;
}

export class SerializerShortAttentionHourPatientDto extends ShortBaseDto {
  @Expose()
  @ApiProperty({ example: '09:00' })
  openingHour: string;

  @Expose()
  @ApiProperty({ example: '13:30' })
  closeHour: string;

  @Expose()
  @ApiProperty({
    example: Object.values(Day).join(', ')
  })
  day: Day;
}
