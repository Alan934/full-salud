import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  ValidateNested
} from 'class-validator';
import { ShortBaseDto } from 'src/common/dtos';
import { IsTime } from 'src/common/util/custom-dto-properties-decorators/validate-hour-decorator.util';
import { Day } from 'src/domain/enums';
import { CreateOfficeWithIdDto } from '../office/office.dto';

export class CreateSpecialistAttentionHourDto {
  @IsNotEmpty()
  @IsTime('startHour')
  @ApiProperty({ example: '09:00' })
  startHour: string;

  @IsNotEmpty()
  @IsTime('endHour')
  @ApiProperty({ example: '13:00' })
  endHour: string;

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

  //recibe opcionalmente el id de un especialista
  @IsOptional()
  @ValidateNested()
  @Type(() => ShortBaseDto)
  specialist: ShortBaseDto;

  //recibe opcionalmente el id de una oficina o una oficina nueva
  @ValidateNested()
  @IsOptional()
  @Type(() => CreateOfficeWithIdDto)
  office?: CreateOfficeWithIdDto;
}

export class UpdateSpecialistAttentionHourDto extends PartialType(
  CreateSpecialistAttentionHourDto
) {}
