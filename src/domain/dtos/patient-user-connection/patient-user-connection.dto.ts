import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumberString, ValidateNested } from 'class-validator';
import { ShortBaseDto } from 'src/common/dtos';
import { CreateAddressWithIdDto, CreatePatientTurnWithIdDto } from '..';

export class CreatePatientUserConnectionDto {
  @IsNotEmpty()
  @IsNumberString()
  @ApiProperty({ example: '2615836294' })
  phone: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ShortBaseDto)
  user: ShortBaseDto;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreatePatientTurnWithIdDto)
  patientTurn: CreatePatientTurnWithIdDto;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ShortBaseDto)
  relationship: ShortBaseDto;

  @ValidateNested()
  @Type(() => CreateAddressWithIdDto)
  addresses: CreateAddressWithIdDto[];
}

export class UpdatePatientUserConnectionDto extends PartialType(
  CreatePatientUserConnectionDto
) {}
