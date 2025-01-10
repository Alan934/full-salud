import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../../common/bases/base.service';
import {
  CreateAttentionHourPatientDto,
  UpdateAttentionHourPatientDto
} from '../../domain/dtos';
import { AttentionHourPatient } from '../../domain/entities';
import { Repository } from 'typeorm';

@Injectable()
export class AttentionHoursPatientService extends BaseService<
  AttentionHourPatient,
  CreateAttentionHourPatientDto,
  UpdateAttentionHourPatientDto
> {
  constructor(
    @InjectRepository(AttentionHourPatient)
    protected repository: Repository<AttentionHourPatient>
  ) {
    super(repository);
  }
}
