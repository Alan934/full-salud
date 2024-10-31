import { Controller } from '@nestjs/common';
import { ExamplesService } from './examples.service';
import { Examples } from '../../domain/entities';
import {
  CreateExampleDto,
  SerializerExampleDto,
  UpdateExampleDto
} from '../../domain/dtos';
import { ControllerFactory } from '../../common/factories/controller.factory';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@Controller('examples')
export class ExamplesController extends ControllerFactory<
  Examples,
  CreateExampleDto,
  UpdateExampleDto,
  SerializerExampleDto
>(Examples, CreateExampleDto, UpdateExampleDto, SerializerExampleDto) {
  constructor(protected service: ExamplesService) {
    super();
  }
}
