import { Controller } from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { Address } from '../../domain/entities';
import {
  CreateAddressDto,
  SerializerAddressDto,
  UpdateAddressDto
} from '../../domain/dtos';
import { ControllerFactory } from '../../common/factories/controller.factory';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Addresses')
@Controller('addresses')
export class AddressesController extends ControllerFactory<
  Address,
  CreateAddressDto,
  UpdateAddressDto,
  SerializerAddressDto
>(Address, CreateAddressDto, UpdateAddressDto, SerializerAddressDto) {
  constructor(protected service: AddressesService) {
    super();
  }
}
