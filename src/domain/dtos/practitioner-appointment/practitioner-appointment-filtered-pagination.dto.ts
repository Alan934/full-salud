import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUUID, IsEnum } from 'class-validator';
import { PaginationDto } from '../../../common/dtos';
import { Day } from '../../enums';
import { IsTime } from '../../../common/util/custom-dto-properties-decorators/validate-hour-decorator.util';

export class PractitionerAppointmentFilteredPaginationDto extends PaginationDto {
  @IsOptional()
  @IsUUID()
  @ApiProperty({
    required: false,
    description: 'Filter by Practitioner ID',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  practitionerId?: string;

  @IsOptional()
  @IsUUID()
  @ApiProperty({
    required: false,
    description: 'Filter by Location ID',
    example: '1a2b3c4d-5e6f-0987-4321-fedcba987654',
  })
  locationId?: string;

  @IsOptional()
  @IsEnum(Day)
  @ApiProperty({
    required: false,
    description: 'Filter by Day of the week',
    examples: [
      Day.SUNDAY,
      Day.MONDAY,
      Day.TUESDAY,
      Day.WEDNESDAY,
      Day.THURSDAY,
      Day.FRIDAY,
      Day.SATURDAY
    ],
  })
  day?: Day;

  @IsOptional()
  @IsTime('startHour')
  @ApiProperty({
    required: false,
    description: 'Filter by start hour (exact match)',
    example: '09:00'
  })
  startHour?: string;

  @IsOptional()
  @IsTime('endHour')
  @ApiProperty({
    required: false,
    description: 'Filter by end hour (exact match)',
    example: '13:00'
  })
  endHour?: string;

}