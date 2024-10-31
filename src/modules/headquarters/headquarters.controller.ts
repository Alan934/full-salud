import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ControllerFactory } from '../../common/factories/controller.factory';
import {
  CreateHeadquartersDto,
  SerializerHeadquartersDto,
  UpdateHeadquartersDto
} from '../../domain/dtos';
import { Headquarters } from '../../domain/entities';
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
