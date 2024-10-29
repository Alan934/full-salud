import { Controller } from '@nestjs/common';
import { PracticesService } from './practices.service';
import { Practice } from 'src/domain/entities';
import { ControllerFactory } from 'src/common/factories/controller.factory';
import {
  CreatePracticeDto,
  SerializerPracticeDto,
  UpdatePracticeDto
} from 'src/domain/dtos';
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
