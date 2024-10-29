import { Controller } from '@nestjs/common';
import { TagsService } from './tags.service';
import { ControllerFactory } from 'src/common/factories/controller.factory';
import { Tag } from 'src/domain/entities';
import { CreateTagDto, SerializerTagDto, UpdateTagDto } from 'src/domain/dtos';
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
