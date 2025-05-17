import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  ValidateNested
} from 'class-validator';
import { ShortBaseDto } from '../../../common/dtos';
import { IsTime } from '../../../common/util/custom-dto-properties-decorators/validate-hour-decorator.util';
import { Day } from '../../enums';
import { CreateLocationWithIdDto } from '../location/location.dto';

export class CreatePractitionerAppointmentDto {
  @IsNotEmpty()
  @ApiProperty({ example: '09:00' })
  startHour: string;

  @IsNotEmpty()
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
  @ApiProperty({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6', description: 'ID of the practitioner this appointment belongs to' })
  practitionerId?: string;

  //recibe opcionalmente el id de una oficina o una oficina nueva
  @IsOptional()
  @IsUUID()
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', description: 'ID of the location where the appointment takes place' })
  locationId?: string;
}

export class UpdatePractitionerAppointmentDto extends PartialType(
  CreatePractitionerAppointmentDto
) {}
