import { Controller } from '@nestjs/common';
import { SpecialitiesService } from './specialities.service';
import { Speciality } from 'src/domain/entities';
import { ControllerFactory } from 'src/common/factories/controller.factory';
import {
  CreateSpecialityDto,
  SerializerSpecialityDto,
  UpdateSpecialityDto
} from 'src/domain/dtos';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Specialities')
@Controller('specialities')
export class SpecialitiesController extends ControllerFactory<
  Speciality,
  CreateSpecialityDto,
  UpdateSpecialityDto,
  SerializerSpecialityDto
>(
  Speciality,
  CreateSpecialityDto,
  UpdateSpecialityDto,
  SerializerSpecialityDto
) {
  constructor(protected service: SpecialitiesService) {
    super();
  }
}
