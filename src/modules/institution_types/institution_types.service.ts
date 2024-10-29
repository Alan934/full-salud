import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/bases/base.service';
import {
  CreateInstitutionTypeDto,
  UpdateInstitutionTypeDto
} from 'src/domain/dtos';
import { InstitutionType } from 'src/domain/entities';
import { Repository } from 'typeorm';

@Injectable()
export class InstitutionTypesService extends BaseService<
  InstitutionType,
  CreateInstitutionTypeDto,
  UpdateInstitutionTypeDto
> {
  constructor(
    @InjectRepository(InstitutionType)
    protected repository: Repository<InstitutionType>
  ) {
    super(repository);
  }
}
