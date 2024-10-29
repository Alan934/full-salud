import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ControllerFactory } from 'src/common/factories/controller.factory';
import {
  CreateIndicationDto,
  SerializerIndicationDto,
  UpdateIndicationDto
} from 'src/domain/dtos';
import { Indication } from 'src/domain/entities';
import { IndicationsService } from './indications.service';

@ApiTags('Indications')
@Controller('indications')
export class IndicationsController extends ControllerFactory<
  Indication,
  CreateIndicationDto,
  UpdateIndicationDto,
  SerializerIndicationDto
>(
  Indication,
  CreateIndicationDto,
  UpdateIndicationDto,
  SerializerIndicationDto
) {
  constructor(protected service: IndicationsService) {
    super();
  }
}
