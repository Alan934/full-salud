import { Controller } from '@nestjs/common';
import { PrescriptionsService } from './prescriptions.service';
import { Prescription } from '../../domain/entities';
import { ControllerFactory } from '../../common/factories/controller.factory';
import {
  CreatePrescriptionDto,
  SerializerPrescriptionDto,
  UpdatePrescriptionDto
} from '../../domain/dtos';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Prescriptions')
@Controller('prescriptions')
export class PrescriptionsController extends ControllerFactory<
  Prescription,
  CreatePrescriptionDto,
  UpdatePrescriptionDto,
  SerializerPrescriptionDto
>(
  Prescription,
  CreatePrescriptionDto,
  UpdatePrescriptionDto,
  SerializerPrescriptionDto
) {
  constructor(protected service: PrescriptionsService) {
    super();
  }
}
