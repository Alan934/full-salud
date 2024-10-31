import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ControllerFactory } from '../../common/factories/controller.factory';
import {
  CreateMedicineDto,
  SerializerMedicineDto,
  UpdateMedicineDto
} from '../../domain/dtos';
import { Medicine } from '../../domain/entities';
import { MedicineService } from './medicine.service';

@ApiTags('Medicines')
@Controller('medicines')
export class MedicineController extends ControllerFactory<
  Medicine,
  CreateMedicineDto,
  UpdateMedicineDto,
  SerializerMedicineDto
>(Medicine, CreateMedicineDto, UpdateMedicineDto, SerializerMedicineDto) {
  constructor(protected service: MedicineService) {
    super();
  }
}
