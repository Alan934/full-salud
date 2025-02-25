import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../../common/bases/base.service';
import {
  CreateRelatedPersonDto,
  UpdateRelatedPersonDto
} from '../../domain/dtos/related-person/RelatedPerson.dto';
import { RelatedPerson } from '../../domain/entities/RelatedPerson.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RelatedPersonService extends BaseService<
  RelatedPerson,
  CreateRelatedPersonDto,
  UpdateRelatedPersonDto
> {
  constructor(
    @InjectRepository(RelatedPerson)
    protected repository: Repository<RelatedPerson>
  ) {
    super(repository);
  }
}
