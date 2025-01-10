import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumberString, ValidateNested } from 'class-validator';
import { ShortBaseDto } from '../../../common/dtos';
import { CreateAddressWithIdDto, CreatePatientTurnWithIdDto } from '..';
import { PersonBaseDto } from '../person/person.dto';

export class CreatePatientDto extends PersonBaseDto{

  @ValidateNested()
  @Type(() => ShortBaseDto)
  user?: ShortBaseDto;

  @ValidateNested()
  @Type(() => CreatePatientTurnWithIdDto)
  patientTurn?: CreatePatientTurnWithIdDto;

  @ValidateNested()
  @Type(() => ShortBaseDto)
  relationship?: ShortBaseDto;

}

export class UpdatePatientDto extends PartialType(
  CreatePatientDto
) {}
