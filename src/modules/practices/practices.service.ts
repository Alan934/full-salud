import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../../common/bases/base.service';
import { CreatePracticeDto, UpdatePracticeDto } from '../../domain/dtos';
import { Practice } from '../../domain/entities';
import { Repository } from 'typeorm';

@Injectable()
export class PracticesService extends BaseService<
  Practice,
  CreatePracticeDto,
  UpdatePracticeDto
> {
  constructor(
    @InjectRepository(Practice) protected repository: Repository<Practice>
  ) {
    super(repository);
  }
}
