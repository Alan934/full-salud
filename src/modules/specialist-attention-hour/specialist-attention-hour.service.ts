import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../../common/bases/base.service';
import {
  CreateSpecialistAttentionHourDto,
  UpdateSpecialistAttentionHourDto
} from '../../domain/dtos';
import { SpecialistAttentionHour } from '../../domain/entities';
import { Repository } from 'typeorm';

@Injectable()
export class SpecialistAttentionHourService extends BaseService<
  SpecialistAttentionHour,
  CreateSpecialistAttentionHourDto,
  UpdateSpecialistAttentionHourDto
> {
  constructor(
    @InjectRepository(SpecialistAttentionHour)
    protected repository: Repository<SpecialistAttentionHour>
  ) {
    super(repository);
  }
}
