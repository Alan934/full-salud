import { Controller } from '@nestjs/common';
import { ControllerFactory } from 'src/common/factories/controller.factory';
import {
  CreateSpecialistSecretaryDto,
  SerializerSpecialistSecretaryDto,
  UpdateSpecialistSecretaryDto
} from 'src/domain/dtos';
import { SpecialistSecretary } from 'src/domain/entities';
import { SpecialistSecretariesService } from './specialist-secretary.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Specialists Secretaries')
@Controller('specialist-secretaries')
export class SpecialistSecretariesController extends ControllerFactory<
  SpecialistSecretary,
  CreateSpecialistSecretaryDto,
  UpdateSpecialistSecretaryDto,
  SerializerSpecialistSecretaryDto
>(
  SpecialistSecretary,
  CreateSpecialistSecretaryDto,
  UpdateSpecialistSecretaryDto,
  SerializerSpecialistSecretaryDto
) {
  constructor(protected service: SpecialistSecretariesService) {
    super();
  }
}
