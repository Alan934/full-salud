import { Controller } from '@nestjs/common';
import { AttentionHoursPatientService } from './attention_hours_patient.service';
import { AttentionHourPatient } from '../../domain/entities';
import { ControllerFactory } from '../../common/factories/controller.factory';
import {
  CreateAttentionHourPatientDto,
  SerializerAttentionHourPatientDto,
  UpdateAttentionHourPatientDto,
} from '../../domain/dtos';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Attention Hours Patients')
@Controller('attention-hours-patient')
export class AttentionHoursPatientController extends ControllerFactory<
  AttentionHourPatient,
  CreateAttentionHourPatientDto,
  UpdateAttentionHourPatientDto,
  SerializerAttentionHourPatientDto
>(
  AttentionHourPatient,
  CreateAttentionHourPatientDto,
  UpdateAttentionHourPatientDto,
  SerializerAttentionHourPatientDto
) {
  constructor(protected service: AttentionHoursPatientService) {
    super();
  }
}
