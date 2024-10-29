import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/bases/base.service';
import {
  CreateAttentionHourDto,
  UpdateAttentionHourDto
} from 'src/domain/dtos';
import { AttentionHour } from 'src/domain/entities';
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
