import { ApiProperty } from '@nestjs/swagger';
import { FullBaseDto } from '../../../common/dtos';
import {
  SerializerDiagnosticDto,
  SerializerShortSpecialistDto,
  SerializerInstitutionDto,
  SerializerShortPatientUserConnectionDto
} from '..';
import { Expose, Type } from 'class-transformer';
import { Role, TurnStatus } from 'src/domain/enums';

export class SerializerTurnDto extends FullBaseDto {
  @Expose()
  @ApiProperty({ example: '14:29:17' })
  date: Date;

  @Expose()
  @ApiProperty({ example: '14:29:17' })
  hour: Date;

  @Expose()
  @ApiProperty({
    example:
      'dolor de pecho opresivo que se irradia hacia el brazo izquierdo, dificultad para respirar y sudoración excesiva'
  })
  observation: string;

  @Expose({ groups: [Role.ADMIN, Role.SECRETARY] }) // Se expone solo para los roles dados
  @ApiProperty({
    description:
      'Fecha estimada de pago por parte de la obra social. Corresponde a la fecha del turno más el tiempo que tarda la obra social en realizar el pago al proveedor de salud. En caso de pago particular, coincide con la fecha del turno.'
  })
  estimatedPaymentDate: Date;

  @Expose({ groups: [Role.ADMIN, Role.SECRETARY] }) // Se expone solo para los roles dados
  @ApiProperty({
    description:
      "Indica si se ha cobrado o no la comisión por derivación a la obra social. En caso de ser 'true', la comisión ya ha sido cobrada.",
    example: 'false'
  })
  paidWorkSocial: boolean;

  @Expose()
  @ApiProperty({
    example: Object.values(TurnStatus).join(', ')
  })
  status: TurnStatus;

  @Expose()
  @Type(() => SerializerShortPatientUserConnectionDto)
  patientUserConnection: SerializerShortPatientUserConnectionDto;

  @Expose()
  @Type(() => SerializerDiagnosticDto)
  diagnostic?: SerializerDiagnosticDto;

  @Expose()
  @Type(() => SerializerShortSpecialistDto)
  specialist?: SerializerShortSpecialistDto;

  @Expose()
  @Type(() => SerializerInstitutionDto)
  institution?: SerializerInstitutionDto;
}
