import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/bases/base.service';
import { CreateExampleDto, UpdateExampleDto } from 'src/domain/dtos';
import { Examples } from 'src/domain/entities';
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
