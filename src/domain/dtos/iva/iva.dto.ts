import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateIvaDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'General' })
  type: string;
}

export class UpdateIvaDto extends PartialType(CreateIvaDto) {}
