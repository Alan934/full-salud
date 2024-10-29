import { Controller } from '@nestjs/common';
import { ControllerFactory } from 'src/common/factories/controller.factory';
import {
  CreateDegreeDto,
  SerializerDegreeDto,
  UpdateDegreeDto
} from 'src/domain/dtos';
import { Degree } from 'src/domain/entities';
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
