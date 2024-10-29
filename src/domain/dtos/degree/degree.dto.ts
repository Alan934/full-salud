import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDegreeDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Doctor' })
  degree: string;
}

export class UpdateDegreeDto extends PartialType(CreateDegreeDto) {}
