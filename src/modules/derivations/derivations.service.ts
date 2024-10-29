import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/bases/base.service';
import { CreateDerivationDto, UpdateDerivationDto } from 'src/domain/dtos';
import { Derivation } from 'src/domain/entities';
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
