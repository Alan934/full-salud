import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../../common/bases/base.service';
import { CreateTagDto, UpdateTagDto } from '../../domain/dtos';
import { Tag } from '../../domain/entities';
import { Repository } from 'typeorm';

@Injectable()
export class TagsService extends BaseService<Tag, CreateTagDto, UpdateTagDto> {
  constructor(
    @InjectRepository(Tag)
    protected repository: Repository<Tag>
  ) {
    super(repository);
  }
}
