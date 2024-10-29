import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTagDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Salud Mental' })
  name: string;
}

export class UpdateTagDto extends PartialType(CreateTagDto) {}
