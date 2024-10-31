import { Controller } from '@nestjs/common';
import { PatientsUsersConnectionsService } from './patients-users-connections.service';
import { ControllerFactory } from '../../common/factories/controller.factory';
import { PatientUserConnection } from '../../domain/entities';
import {
  CreatePatientUserConnectionDto,
  SerializerPatientUserConnectionDto,
  UpdatePatientUserConnectionDto
} from '../../domain/dtos';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Patients Users Connections')
@Controller('patients-users-connections')
export class PatientsUsersConnectionsController extends ControllerFactory<
  PatientUserConnection,
  CreatePatientUserConnectionDto,
  UpdatePatientUserConnectionDto,
  SerializerPatientUserConnectionDto
>(
  PatientUserConnection,
  CreatePatientUserConnectionDto,
  UpdatePatientUserConnectionDto,
  SerializerPatientUserConnectionDto
) {
  constructor(protected readonly service: PatientsUsersConnectionsService) {
    super();
  }
}
