import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested
} from 'class-validator';
import { ShortBaseDto } from 'src/common/dtos';

export class CreateMemberSocialWorkDto {
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

export class UpdateMemberSocialWorkDto extends PartialType(
  CreateMemberSocialWorkDto
) {}
