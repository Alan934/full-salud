import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../../common/bases/base.service';
import {
  CreateAttentionHourDto,
  UpdateAttentionHourDto
} from '../../domain/dtos';
import { AttentionHour } from '../../domain/entities';
import { Repository } from 'typeorm';

@Injectable()
export class AttentionHoursService extends BaseService<
  AttentionHour,
  CreateAttentionHourDto,
  UpdateAttentionHourDto
> {
  constructor(
    @InjectRepository(AttentionHour)
    protected repository: Repository<AttentionHour>
  ) {
    super(repository);
  }
}
