import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  ValidateIf,
  ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateMemberSocialWorkDto, CreatePatientDto } from '..';

export class CreatePatientTurnDto {
  @IsOptional()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateMemberSocialWorkDto)
  @ValidateIf((o) => !o.id)
  memberSocialWork?: CreateMemberSocialWorkDto;

  @IsNotEmpty()
  @IsBoolean()
  @Type(() => Boolean)
  @ApiProperty({ examples: ['false', 'true'] })
  @ValidateIf((o) => !o.id)
  isDisabled: boolean;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreatePatientDto)
  @ValidateIf((o) => !o.id)
  person: CreatePatientDto;
}

export class UpdatePatientTurnDto extends PartialType(CreatePatientTurnDto) {}

export class CreatePatientTurnWithIdDto extends CreatePatientTurnDto {
  @IsOptional()
  @IsUUID()
  @ValidateIf((o) => !o.memberSocialWork && !o.isDisabled && !o.person)
  @ApiProperty({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  id?: string;
}
