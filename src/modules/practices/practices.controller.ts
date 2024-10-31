import { Controller } from '@nestjs/common';
import { PracticesService } from './practices.service';
import { Practice } from '../../domain/entities';
import { ControllerFactory } from '../../common/factories/controller.factory';
import {
  CreatePracticeDto,
  SerializerPracticeDto,
  UpdatePracticeDto
} from '../../domain/dtos';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Practices')
@Controller('practices')
export class PracticesController extends ControllerFactory<
  Practice,
  CreatePracticeDto,
  UpdatePracticeDto,
  SerializerPracticeDto
>(Practice, CreatePracticeDto, UpdatePracticeDto, SerializerPracticeDto) {
  constructor(protected service: PracticesService) {
    super();
  }
}
