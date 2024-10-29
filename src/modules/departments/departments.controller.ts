import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOperation,
  ApiParam,
  ApiTags
} from '@nestjs/swagger';
import { ControllerFactory } from 'src/common/factories/controller.factory';
import {
  CreateDepartmentDto,
  SerializerDepartmentDto,
  SerializerShortDepartmentDto,
  UpdateDepartmentDto
} from 'src/domain/dtos';
import { Department } from 'src/domain/entities';
import { DepartmentsService } from './departments.service';
import { PaginationDto } from 'src/common/dtos/pagination-common.dto';
import { toDtoList } from 'src/common/util/transform-dto.util';
import { ApiPaginationResponse } from 'src/common/swagger/api-pagination-response';

@ApiTags('Departments')
@ApiExtraModels(SerializerShortDepartmentDto) // Registrar el DTO en Swagger
@Controller('departments')
export class DepartmentsController extends ControllerFactory<
  Department,
  CreateDepartmentDto,
  UpdateDepartmentDto,
  SerializerDepartmentDto
>(
  Department,
  CreateDepartmentDto,
  UpdateDepartmentDto,
  SerializerDepartmentDto
) {
  constructor(protected service: DepartmentsService) {
    super();
  }

  @Get('by-province/:provinceId')
  @ApiParam({
    name: 'provinceId',
    type: 'string',
    description: 'ID de la provincia'
  })
  @ApiOperation({
    description: 'Obtener departamentos por ID de provincia con paginación'
  })
  @ApiPaginationResponse(SerializerShortDepartmentDto) // Aplicar el decorador ApiPaginationResponse
  async findByProvince(
    @Param('provinceId') provinceId: string,
    @Query() paginationDto: PaginationDto
  ) {
    const { data, meta } = await this.service.findByProvince(
      provinceId,
      paginationDto
    );
    return { data: toDtoList(SerializerShortDepartmentDto, data), meta };
  }
}
