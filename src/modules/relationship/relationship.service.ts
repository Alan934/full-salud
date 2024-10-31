import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../../common/bases/base.service';
import {
  CreateRelationshipDto,
  UpdateRelationshipDto
} from '../../domain/dtos/relationship/relationship.dto';
import { Relationship } from '../../domain/entities/relationship.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RelationshipService extends BaseService<
  Relationship,
  CreateRelationshipDto,
  UpdateRelationshipDto
> {
  constructor(
    @InjectRepository(Relationship)
    protected repository: Repository<Relationship>
  ) {
    super(repository);
  }
}
