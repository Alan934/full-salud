import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../../common/bases/base.service';
import {
  CreateInstitutionTypeDto,
  UpdateInstitutionTypeDto
} from '../../domain/dtos';
import { InstitutionType } from '../../domain/entities';
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
