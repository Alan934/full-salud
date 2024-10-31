import { Controller } from '@nestjs/common';
import { ControllerFactory } from '../../common/factories/controller.factory';
import {
  CreateRelationshipDto,
  SerializerRelationshipDto,
  UpdateRelationshipDto
} from '../../domain/dtos';
import { Relationship } from '../../domain/entities/relationship.entity';
import { RelationshipService } from './relationship.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Relationships')
@Controller('relationships')
export class RelationshipController extends ControllerFactory<
  Relationship,
  CreateRelationshipDto,
  UpdateRelationshipDto,
  SerializerRelationshipDto
>(
  Relationship,
  CreateRelationshipDto,
  UpdateRelationshipDto,
  SerializerRelationshipDto
) {
  constructor(protected service: RelationshipService) {
    super();
  }
}
