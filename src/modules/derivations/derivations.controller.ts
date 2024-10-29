import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ControllerFactory } from 'src/common/factories/controller.factory';
import {
  CreateDerivationDto,
  UpdateDerivationDto,
  SerializerDerivationDto
} from 'src/domain/dtos';
import { Derivation } from 'src/domain/entities';
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
