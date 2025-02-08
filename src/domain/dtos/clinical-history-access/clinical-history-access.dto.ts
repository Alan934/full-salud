import { IsNotEmpty, IsString } from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ShortBaseDto } from '../../../common/dtos';
import { string } from 'joi';

export class CreateClinicalHistoryAccessDto {
  @IsNotEmpty()
  @IsString()
  @Type(() => string)
  expirationDate: string;

  //Recbie el id del especialista que va a pertenecer al historial
  @IsNotEmpty()
  @Type(() => ShortBaseDto)
  practitioner: ShortBaseDto;

  //Recibe el id de patientTurn que va a pertenecer al historial
  @IsNotEmpty()
  @Type(() => ShortBaseDto)
  patientTurn: ShortBaseDto;
}
export class UpdateClinicalHistoryAccessDto extends PartialType(
  CreateClinicalHistoryAccessDto
) {}
