import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreatePracticeDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @ApiProperty({ example: 'Consulta médica' })
  name: string;
}

export class UpdatePracticeDto extends PartialType(CreatePracticeDto) {}
