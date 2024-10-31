import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ControllerFactory } from '../../common/factories/controller.factory';
import {
  SerializerCommissionDto,
  CreateCommissionDto,
  UpdateCommissionDto
} from '../../domain/dtos';
import { Commission } from '../../domain/entities/commission.entity';
import { CommissionsService } from './commissions.service';

@ApiTags('Commissions')
@Controller('commissions')
export class CommissionsController extends ControllerFactory<
  Commission,
  CreateCommissionDto,
  UpdateCommissionDto,
  SerializerCommissionDto
>(
  Commission,
  CreateCommissionDto,
  UpdateCommissionDto,
  SerializerCommissionDto
) {
  constructor(protected service: CommissionsService) {
    super();
  }
}
