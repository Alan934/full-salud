import { Controller } from '@nestjs/common';
import { IvaTypesService } from './iva_types.service';
import { Iva } from '../../domain/entities';
import { ControllerFactory } from '../../common/factories/controller.factory';
import { CreateIvaDto, SerializerIvaDto, UpdateIvaDto } from '../../domain/dtos';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('IVA Types')
@Controller('iva-types')
export class IvaTypesController extends ControllerFactory<
  Iva,
  CreateIvaDto,
  UpdateIvaDto,
  SerializerIvaDto
>(Iva, CreateIvaDto, UpdateIvaDto, SerializerIvaDto) {
  constructor(protected service: IvaTypesService) {
    super();
  }
}
