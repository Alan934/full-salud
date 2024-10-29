import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ControllerFactory } from 'src/common/factories/controller.factory';
import {
  CreateHeadquartersDto,
  SerializerHeadquartersDto,
  UpdateHeadquartersDto
} from 'src/domain/dtos';
import { Headquarters } from 'src/domain/entities';
import { HeadquartersService } from './headquarters.service';

@Controller('headquarters')
@ApiTags('Headquarters')
export class HeadquartersController extends ControllerFactory<
  Headquarters,
  CreateHeadquartersDto,
  UpdateHeadquartersDto,
  SerializerHeadquartersDto
>(
  Headquarters,
  CreateHeadquartersDto,
  UpdateHeadquartersDto,
  SerializerHeadquartersDto
) {
  constructor(protected service: HeadquartersService) {
    super();
  }
}
