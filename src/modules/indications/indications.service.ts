import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/bases/base.service';
import { CreateIndicationDto, UpdateIndicationDto } from 'src/domain/dtos';
import { Indication } from 'src/domain/entities';
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
