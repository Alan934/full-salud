import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/bases/base.service';
import { CreateIvaDto, UpdateIvaDto } from 'src/domain/dtos';
import { Iva } from 'src/domain/entities';
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
