import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/bases/base.service';
import {
  CreateSpecialistAttentionHourDto,
  UpdateSpecialistAttentionHourDto
} from 'src/domain/dtos';
import { SpecialistAttentionHour } from 'src/domain/entities';
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
