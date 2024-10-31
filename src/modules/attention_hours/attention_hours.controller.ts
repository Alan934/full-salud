import { Controller } from '@nestjs/common';
import { AttentionHoursService } from './attention_hours.service';
import { AttentionHour } from '../../domain/entities';
import { ControllerFactory } from '../../common/factories/controller.factory';
import {
  CreateAttentionHourDto,
  SerializerAttentionHourDto,
  UpdateAttentionHourDto
} from '../../domain/dtos';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Attention Hours')
@Controller('attention-hours')
export class AttentionHoursController extends ControllerFactory<
  AttentionHour,
  CreateAttentionHourDto,
  UpdateAttentionHourDto,
  SerializerAttentionHourDto
>(
  AttentionHour,
  CreateAttentionHourDto,
  UpdateAttentionHourDto,
  SerializerAttentionHourDto
) {
  constructor(protected service: AttentionHoursService) {
    super();
  }
}
