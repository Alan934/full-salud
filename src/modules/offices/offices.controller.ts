import { Controller } from '@nestjs/common';
import { ControllerFactory } from '../../common/factories/controller.factory';
import {
  CreateOfficeDto,
  SerializerOfficeDto,
  UpdateOfficeDto
} from '../../domain/dtos';
import { Office } from '../../domain/entities';
import { OfficesService } from './offices.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Offices')
@Controller('offices')
export class OfficesController extends ControllerFactory<
  Office,
  CreateOfficeDto,
  UpdateOfficeDto,
  SerializerOfficeDto
>(Office, CreateOfficeDto, UpdateOfficeDto, SerializerOfficeDto) {
  constructor(protected service: OfficesService) {
    super();
  }
}
