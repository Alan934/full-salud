import { Controller } from '@nestjs/common';
import { ControllerFactory } from 'src/common/factories/controller.factory';
import {
  CreateInstitutionTypeDto,
  UpdateInstitutionTypeDto,
  SerializerInstitutionTypeDto
} from 'src/domain/dtos';
import { InstitutionType } from 'src/domain/entities';
import { InstitutionTypesService } from './institution_types.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Institution Types')
@Controller('institution-types')
export class InstitutionTypesController extends ControllerFactory<
  InstitutionType,
  CreateInstitutionTypeDto,
  UpdateInstitutionTypeDto,
  SerializerInstitutionTypeDto
>(
  InstitutionType,
  CreateInstitutionTypeDto,
  UpdateInstitutionTypeDto,
  SerializerInstitutionTypeDto
) {
  constructor(protected service: InstitutionTypesService) {
    super();
  }
}
