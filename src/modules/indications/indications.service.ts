import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../../common/bases/base.service';
import { CreateIndicationDto, UpdateIndicationDto } from '../../domain/dtos';
import { Indication } from '../../domain/entities';
import { Repository } from 'typeorm';

@Injectable()
export class IndicationsService extends BaseService<
  Indication,
  CreateIndicationDto,
  UpdateIndicationDto
> {
  constructor(
    @InjectRepository(Indication)
    protected repository: Repository<Indication>
  ) {
    super(repository);
  }
}
