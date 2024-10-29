import { Expose, Type } from 'class-transformer';
import { ShortBaseDto } from 'src/common/dtos';
import { SerializerShortSpecialistDto } from '../specialist/specialist-serializer.dto';
import { SerializerShortPacientTurnDto } from '../patient-turn/patient-turn-serializer.dto';

export class SerializerClinicalHistoryAccessDto extends ShortBaseDto {
  @Expose()
  expirationDate: Date;

  @Expose()
  @Type(() => SerializerShortSpecialistDto)
  specialist: SerializerShortSpecialistDto;

  @Expose()
  @Type(() => SerializerShortPacientTurnDto)
  patientTurn: SerializerShortPacientTurnDto;
}
