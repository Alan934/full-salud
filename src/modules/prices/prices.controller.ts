import { Controller } from '@nestjs/common';
import { PricesService } from './prices.service';
import { Price } from '../../domain/entities';
import { ControllerFactory } from '../../common/factories/controller.factory';
import {
  CreatePriceDto,
  SerializerPriceDto,
  UpdatePriceDto
} from '../../domain/dtos';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Prices')
@Controller('prices')
export class PricesController extends ControllerFactory<
  Price,
  CreatePriceDto,
  UpdatePriceDto,
  SerializerPriceDto
>(Price, CreatePriceDto, UpdatePriceDto, SerializerPriceDto) {
  constructor(protected service: PricesService) {
    super();
  }
}
