import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../../common/bases/base.service';
import {
  CreateClinicalHistoryAccessDto,
  UpdateClinicalHistoryAccessDto
} from '../../domain/dtos';
import { ClinicalHistoryAccess } from '../../domain/entities';
import { Repository } from 'typeorm';

@Injectable()
export class ClinicalHistoryAccessesService extends BaseService<
  ClinicalHistoryAccess,
  CreateClinicalHistoryAccessDto,
  UpdateClinicalHistoryAccessDto
> {
  constructor(
    @InjectRepository(ClinicalHistoryAccess)
    protected repository: Repository<ClinicalHistoryAccess>
  ) {
    super(repository);
  }
}
