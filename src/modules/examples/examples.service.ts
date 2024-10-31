import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../../common/bases/base.service';
import { CreateExampleDto, UpdateExampleDto } from '../../domain/dtos';
import { Examples } from '../../domain/entities';
import { Repository } from 'typeorm';

@Injectable()
export class ExamplesService extends BaseService<
  Examples,
  CreateExampleDto,
  UpdateExampleDto
> {
  constructor(
    @InjectRepository(Examples) protected repository: Repository<Examples>
  ) {
    super(repository);
  }
}
