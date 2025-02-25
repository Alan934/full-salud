import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested
} from 'class-validator';
import { ShortBaseDto } from '../../../common/dtos';

export class CreateSocialWorkEnrollmentDto {
  @IsNotEmpty()
  @IsOptional()
  @IsString()
  @ApiProperty({ example: '12345678' })
  memberNum: string;

  @IsString()
  @ApiProperty({ example: 'A35' })
  plan: string;

  //recibe el id de la obra social
  @IsOptional()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ShortBaseDto)
  socialWork?: ShortBaseDto;
}

export class UpdateSocialWorkEnrollmentDto extends PartialType(
  CreateSocialWorkEnrollmentDto
) {}
