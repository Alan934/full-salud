import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { FullBaseDto, ShortBaseDto } from 'src/common/dtos';
import { Day } from 'src/domain/enums';

export class SerializerAttentionHourDto extends FullBaseDto {
  @Expose()
  @ApiProperty({ example: '09:00' })
  openingHour: Date;

  @Expose()
  @ApiProperty({ example: '13:30' })
  closeHour: Date;

  @Expose()
  @ApiProperty({
    example: Object.values(Day).join(', ')
  })
  day: Day;
}

export class SerializerShortAttentionHourDto extends ShortBaseDto {
  @Expose()
  @ApiProperty({ example: '09:00' })
  openingHour: Date;

  @Expose()
  @ApiProperty({ example: '13:30' })
  closeHour: Date;

  @Expose()
  @ApiProperty({
    example: Object.values(Day).join(', ')
  })
  day: Day;
}
