import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/bases/base.service';
import { CreateTagDto, UpdateTagDto } from 'src/domain/dtos';
import { Tag } from 'src/domain/entities';
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
