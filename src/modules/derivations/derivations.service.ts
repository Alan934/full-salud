import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../../common/bases/base.service';
import { CreateDerivationDto, UpdateDerivationDto } from '../../domain/dtos';
import { Derivation } from '../../domain/entities';
import { Repository } from 'typeorm';

@Injectable()
export class DerivationsService extends BaseService<
  Derivation,
  CreateDerivationDto,
  UpdateDerivationDto
> {
  constructor(
    @InjectRepository(Derivation)
    protected repository: Repository<Derivation>
  ) {
    super(repository);
  }
}
