import { Expose, Type } from 'class-transformer';
import { ShortBaseDto } from '../../../common/dtos';
import { SerializerShortPacientTurnDto } from '../patient-turn/patient-turn-serializer.dto';
import { SerializerShortPractitionerDto } from '../practitioner/Practitioner-serializer.dto';

export class SerializerClinicalHistoryAccessDto extends ShortBaseDto {
  @Expose()
  expirationDate: string;

  @Expose()
  @Type(() => SerializerShortPractitionerDto)
  practitioner: SerializerShortPractitionerDto;

  @Expose()
  @Type(() => SerializerShortPacientTurnDto)
  patientTurn: SerializerShortPacientTurnDto;
}
