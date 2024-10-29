import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Day } from 'src/domain/enums';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';
import { IsTime } from 'src/common/util/custom-dto-properties-decorators/validate-hour-decorator.util';
import { ShortBaseDto } from 'src/common/dtos';

export class CreateAttentionHourDto {
  @IsNotEmpty()
  @IsTime('openingHour')
  @ApiProperty({ example: '09:00' })
  openingHour: string;

  @IsNotEmpty()
  @IsTime('closeHour')
  @ApiProperty({ example: '13:30' })
  closeHour: string;

  @IsNotEmpty()
  @IsEnum(Day)
  @ApiProperty({
    examples: [
      Day.SUNDAY,
      Day.MONDAY,
      Day.TUESDAY,
      Day.WEDNESDAY,
      Day.THURSDAY,
      Day.FRIDAY,
      Day.SATURDAY
    ]
  })
  day: Day;

  @ValidateNested()
  @IsOptional()
  @Type(() => ShortBaseDto)
  headquarters?: ShortBaseDto;
}

export class UpdateAttentionHourDto extends PartialType(
  CreateAttentionHourDto
) {
  @IsOptional()
  @IsNotEmpty()
  @IsUUID()
  id?: string;
}
