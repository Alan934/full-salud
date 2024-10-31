import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../../common/bases/base.service';
import { CreateDegreeDto, UpdateDegreeDto } from '../../domain/dtos';
import { Degree } from '../../domain/entities';
import { Repository } from 'typeorm';

@Injectable()
export class DegreesService extends BaseService<
  Degree,
  CreateDegreeDto,
  UpdateDegreeDto
> {
  constructor(
    @InjectRepository(Degree) protected repository: Repository<Degree>
  ) {
    super(repository);
  }
}
