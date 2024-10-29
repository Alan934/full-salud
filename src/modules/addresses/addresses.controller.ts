import { Controller } from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { Address } from 'src/domain/entities';
import {
  CreateAddressDto,
  SerializerAddressDto,
  UpdateAddressDto
} from 'src/domain/dtos';
import { ControllerFactory } from 'src/common/factories/controller.factory';
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
