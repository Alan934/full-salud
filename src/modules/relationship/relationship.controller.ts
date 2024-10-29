import { Controller } from '@nestjs/common';
import { ControllerFactory } from 'src/common/factories/controller.factory';
import {
  CreateRelationshipDto,
  SerializerRelationshipDto,
  UpdateRelationshipDto
} from 'src/domain/dtos';
import { Relationship } from 'src/domain/entities/relationship.entity';
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
