import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/bases/base.service';
import { CreateDegreeDto, UpdateDegreeDto } from 'src/domain/dtos';
import { Degree } from 'src/domain/entities';
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
