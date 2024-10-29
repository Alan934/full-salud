import { Controller } from '@nestjs/common';
import { SpecialistAttentionHourService } from './specialist-attention-hour.service';
import { ControllerFactory } from 'src/common/factories/controller.factory';
import {
  CreateSpecialistAttentionHourDto,
  UpdateSpecialistAttentionHourDto,
  SerializerSpecialistAttentionHourDto
} from 'src/domain/dtos';
import { ApiTags } from '@nestjs/swagger';
import { SpecialistAttentionHour } from 'src/domain/entities';

@Controller('specialist-attention-hour')
@ApiTags('Specialist Attention Hour')
export class SpecialistAttentionHourController extends ControllerFactory<
  SpecialistAttentionHour,
  CreateSpecialistAttentionHourDto,
  UpdateSpecialistAttentionHourDto,
  SerializerSpecialistAttentionHourDto
>(
  SpecialistAttentionHour,
  CreateSpecialistAttentionHourDto,
  UpdateSpecialistAttentionHourDto,
  SerializerSpecialistAttentionHourDto
) {
  constructor(protected service: SpecialistAttentionHourService) {
    super();
  }
}
