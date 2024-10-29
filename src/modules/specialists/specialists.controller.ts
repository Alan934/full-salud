import { Controller, Get, Query } from '@nestjs/common';
import { SpecialistsService } from './specialists.service';
import { Specialist } from 'src/domain/entities';
import { ControllerFactory } from 'src/common/factories/controller.factory';
import {
  CreateSpecialistDto,
  SerializerSpecialistDto,
  SpecialistFilteredPaginationDto,
  UpdateSpecialistDto
} from 'src/domain/dtos';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiPaginationResponse } from 'src/common/swagger/api-pagination-response';
import { toDtoList } from 'src/common/util/transform-dto.util';
import { PaginationMetadata } from 'src/common/util/pagination-data.util';

@ApiTags('Specialists')
@Controller('specialists')
export class SpecialistsController extends ControllerFactory<
  Specialist,
  CreateSpecialistDto,
  UpdateSpecialistDto,
  SerializerSpecialistDto
>(
  Specialist,
  CreateSpecialistDto,
  UpdateSpecialistDto,
  SerializerSpecialistDto
) {
  constructor(protected service: SpecialistsService) {
    super();
  }

  @Get()
  @ApiOperation({
    description: 'Obtener specialist paginados con filtros opcionales'
  })
  @ApiPaginationResponse(SerializerSpecialistDto)
  override async findAll(
    @Query()
    paginationDto: SpecialistFilteredPaginationDto
  ): Promise<{ data: SerializerSpecialistDto[]; meta: PaginationMetadata }> {
    const { data, meta } = await this.service.findAll(paginationDto);
    const serializedData = toDtoList(SerializerSpecialistDto, data);
    return { data: serializedData, meta };
  }
}
