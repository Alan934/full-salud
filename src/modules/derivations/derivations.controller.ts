import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ControllerFactory } from '../../common/factories/controller.factory';
import {
  CreateDerivationDto,
  UpdateDerivationDto,
  SerializerDerivationDto
} from '../../domain/dtos';
import { Derivation } from '../../domain/entities';
import { DerivationsService } from './derivations.service';

@ApiTags('Derivations')
@Controller('derivations')
export class DerivationsController extends ControllerFactory<
  Derivation,
  CreateDerivationDto,
  UpdateDerivationDto,
  SerializerDerivationDto
>(
  Derivation,
  CreateDerivationDto,
  UpdateDerivationDto,
  SerializerDerivationDto
) {
  constructor(protected service: DerivationsService) {
    super();
  }
}
