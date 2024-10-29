import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/bases/base.service';
import {
  CreateIndicationDetailDto,
  UpdateIndicationDetailDto
} from 'src/domain/dtos';
import { IndicationDetail } from 'src/domain/entities';
import { Repository } from 'typeorm';

@Injectable()
export class IndicationDetailsService extends BaseService<
  IndicationDetail,
  CreateIndicationDetailDto,
  UpdateIndicationDetailDto
> {
  constructor(
    @InjectRepository(IndicationDetail)
    protected repository: Repository<IndicationDetail>
  ) {
    super(repository);
  }
}
