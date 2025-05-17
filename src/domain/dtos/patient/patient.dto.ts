import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested, IsOptional, IsString } from 'class-validator';
import { ShortBaseDto } from '../../../common/dtos';
import { UserDto } from '../user/user.dto';

export class CreatePatientDto extends OmitType(UserDto, ['role'] as const) {
  
  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Peréz' })
  emailTutor?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Peréz' })
  phoneTutor?: string;

  @ValidateNested()
  @Type(() => ShortBaseDto)
  @IsOptional()
  relationship?: ShortBaseDto;
}

export class UpdatePatientDto extends PartialType(CreatePatientDto) {}