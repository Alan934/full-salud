import { Controller } from '@nestjs/common';
import { TagsService } from './tags.service';
import { ControllerFactory } from '../../common/factories/controller.factory';
import { Tag } from '../../domain/entities';
import { CreateTagDto, SerializerTagDto, UpdateTagDto } from '../../domain/dtos';
import { ApiTags } from '@nestjs/swagger';

@Controller('tags')
@ApiTags('Tags')
export class TagsController extends ControllerFactory<
  Tag,
  CreateTagDto,
  UpdateTagDto,
  SerializerTagDto
>(Tag, CreateTagDto, UpdateTagDto, SerializerTagDto) {
  constructor(private readonly service: TagsService) {
    super();
  }
}
