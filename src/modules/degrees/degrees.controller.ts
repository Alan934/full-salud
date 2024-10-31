import { Controller } from '@nestjs/common';
import { ControllerFactory } from '../../common/factories/controller.factory';
import {
  CreateDegreeDto,
  SerializerDegreeDto,
  UpdateDegreeDto
} from '../../domain/dtos';
import { Degree } from '../../domain/entities';
import { DegreesService } from './degrees.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Degrees')
@Controller('degrees')
export class DegreesController extends ControllerFactory<
  Degree,
  CreateDegreeDto,
  UpdateDegreeDto,
  SerializerDegreeDto
>(Degree, CreateDegreeDto, UpdateDegreeDto, SerializerDegreeDto) {
  constructor(protected service: DegreesService) {
    super();
  }
}
