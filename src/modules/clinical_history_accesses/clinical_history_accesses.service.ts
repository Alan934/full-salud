import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/bases/base.service';
import {
  CreateClinicalHistoryAccessDto,
  UpdateClinicalHistoryAccessDto
} from 'src/domain/dtos';
import { ClinicalHistoryAccess } from 'src/domain/entities';
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
