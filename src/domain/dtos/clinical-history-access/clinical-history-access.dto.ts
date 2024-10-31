import { IsNotEmpty, IsDate } from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ShortBaseDto } from '../../../common/dtos';

export class CreateClinicalHistoryAccessDto {
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  expirationDate: Date;

  //Recbie el id del especialista que va a pertenecer al historial
  @IsNotEmpty()
  @Type(() => ShortBaseDto)
  specialist: ShortBaseDto;

  //Recibe el id de patientTurn que va a pertenecer al historial
  @IsNotEmpty()
  @Type(() => ShortBaseDto)
  patientTurn: ShortBaseDto;
}
export class UpdateClinicalHistoryAccessDto extends PartialType(
  CreateClinicalHistoryAccessDto
) {}
