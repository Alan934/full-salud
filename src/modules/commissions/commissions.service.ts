import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../../common/bases/base.service';
import { CreateCommissionDto, UpdateCommissionDto } from '../../domain/dtos';
import { Commission } from '../../domain/entities/commission.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CommissionsService extends BaseService<
  Commission,
  CreateCommissionDto,
  UpdateCommissionDto
> {
  constructor(
    @InjectRepository(Commission)
    protected repository: Repository<Commission>
  ) {
    super(repository);
  }
}
