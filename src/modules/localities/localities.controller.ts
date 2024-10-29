import { Controller, Get, Param, Query } from '@nestjs/common';
import { LocalitiesService } from './localities.service';
import { Locality } from 'src/domain/entities';
import { ControllerFactory } from 'src/common/factories/controller.factory';
import {
  CreateLocalityDto,
  SerailizerShortLocalityDto,
  SerializerLocalityDto,
  UpdateLocalityDto
} from 'src/domain/dtos';
import {
  ApiExtraModels,
  ApiOperation,
  ApiParam,
  ApiTags
} from '@nestjs/swagger';
import { PaginationDto } from 'src/common/dtos/pagination-common.dto';
import { toDtoList } from 'src/common/util/transform-dto.util';
import { ApiPaginationResponse } from 'src/common/swagger/api-pagination-response';

@ApiTags('Localities')
@ApiExtraModels(SerailizerShortLocalityDto)
@Controller('localities')
export class LocalitiesController extends ControllerFactory<
  Locality,
  CreateLocalityDto,
  UpdateLocalityDto,
  SerializerLocalityDto
>(Locality, CreateLocalityDto, UpdateLocalityDto, SerializerLocalityDto) {
  constructor(protected service: LocalitiesService) {
    super();
  }

  @Get('by-department/:departmentId')
  @ApiParam({
    name: 'departmentId',
    type: 'string',
    description: 'ID del Departamento'
  })
  @ApiOperation({
    description: 'Obtener localidades por ID de departamento con paginación'
  })
  @ApiPaginationResponse(SerailizerShortLocalityDto)
  async findByDepartment(
    @Param('departmentId') provinceId: string,
    @Query() PaginationDto: PaginationDto
  ) {
    const { data, meta } = await this.service.findByDepartment(
      provinceId,
      PaginationDto
    );
    return { data: toDtoList(SerailizerShortLocalityDto, data), meta };
  }
}
