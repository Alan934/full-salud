import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { LocalityService } from './locality.service';
import { Locality } from '../../domain/entities';
import { ControllerFactory } from '../../common/factories/controller.factory';
import {
  CreateLocalityDto,
  SerailizerShortLocalityDto,
  SerializerLocalityDto,
  UpdateLocalityDto
} from '../../domain/dtos';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOperation,
  ApiParam,
  ApiTags
} from '@nestjs/swagger';
import { PaginationDto } from '../../common/dtos/pagination-common.dto';
import { toDtoList } from '../../common/util/transform-dto.util';
import { ApiPaginationResponse } from '../../common/swagger/api-pagination-response';
import { AuthGuard, Roles, RolesGuard } from '../auth/guards/auth.guard';
import { Role } from '../../domain/enums';

@ApiTags('Localities')
@ApiExtraModels(SerailizerShortLocalityDto)
@Controller('localities')
export class LocalityController extends ControllerFactory<
  Locality,
  CreateLocalityDto,
  UpdateLocalityDto,
  SerializerLocalityDto
>(Locality, CreateLocalityDto, UpdateLocalityDto, SerializerLocalityDto) {
  constructor(protected service: LocalityService) {
    super();
  }

  @Roles(Role.PRACTITIONER, Role.ADMIN, Role.PATIENT)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('bearerAuth')
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
