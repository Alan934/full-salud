import { Controller } from '@nestjs/common';
import { ExamplesService } from './examples.service';
import { Examples } from 'src/domain/entities';
import {
  CreateExampleDto,
  SerializerExampleDto,
  UpdateExampleDto
} from 'src/domain/dtos';
import { ControllerFactory } from 'src/common/factories/controller.factory';
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
