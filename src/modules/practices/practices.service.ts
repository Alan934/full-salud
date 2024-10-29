import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/bases/base.service';
import { CreatePracticeDto, UpdatePracticeDto } from 'src/domain/dtos';
import { Practice } from 'src/domain/entities';
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
