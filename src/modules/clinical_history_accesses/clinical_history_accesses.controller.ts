import { Controller } from '@nestjs/common';
import { ControllerFactory } from '../../common/factories/controller.factory';
import {
  SerializerClinicalHistoryAccessDto,
  CreateClinicalHistoryAccessDto,
  UpdateClinicalHistoryAccessDto
} from '../../domain/dtos';
import { ClinicalHistoryAccess } from '../../domain/entities';
import { ClinicalHistoryAccessesService } from './clinical_history_accesses.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Clinical History Accesses')
@Controller('clinical-history-accesses')
export class ClinicalHistoryAccessesController extends ControllerFactory<
  ClinicalHistoryAccess,
  CreateClinicalHistoryAccessDto,
  UpdateClinicalHistoryAccessDto,
  SerializerClinicalHistoryAccessDto
>(
  ClinicalHistoryAccess,
  CreateClinicalHistoryAccessDto,
  UpdateClinicalHistoryAccessDto,
  SerializerClinicalHistoryAccessDto
) {
  constructor(protected service: ClinicalHistoryAccessesService) {
    super();
  }
}
