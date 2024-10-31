import { Controller } from '@nestjs/common';
import { SpecialitiesService } from './specialities.service';
import { Speciality } from '../../domain/entities';
import { ControllerFactory } from '../../common/factories/controller.factory';
import {
  CreateSpecialityDto,
  SerializerSpecialityDto,
  UpdateSpecialityDto
} from '../../domain/dtos';
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
