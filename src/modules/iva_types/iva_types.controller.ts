import { Controller } from '@nestjs/common';
import { IvaTypesService } from './iva_types.service';
import { Iva } from 'src/domain/entities';
import { ControllerFactory } from 'src/common/factories/controller.factory';
import { CreateIvaDto, SerializerIvaDto, UpdateIvaDto } from 'src/domain/dtos';
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
