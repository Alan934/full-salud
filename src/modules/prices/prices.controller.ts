import { Controller } from '@nestjs/common';
import { PricesService } from './prices.service';
import { Price } from 'src/domain/entities';
import { ControllerFactory } from 'src/common/factories/controller.factory';
import {
  CreatePriceDto,
  SerializerPriceDto,
  UpdatePriceDto
} from 'src/domain/dtos';
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
