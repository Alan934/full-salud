import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSocialWorkDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'OSEP' })
  name: string;
}

export class UpdateSocialWorkDto extends PartialType(CreateSocialWorkDto) {}
