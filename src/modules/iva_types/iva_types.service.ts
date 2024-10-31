import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../../common/bases/base.service';
import { CreateIvaDto, UpdateIvaDto } from '../../domain/dtos';
import { Iva } from '../../domain/entities';
import { Repository } from 'typeorm';

@Injectable()
export class IvaTypesService extends BaseService<
  Iva,
  CreateIvaDto,
  UpdateIvaDto
> {
  constructor(@InjectRepository(Iva) protected repository: Repository<Iva>) {
    super(repository);
  }
}
