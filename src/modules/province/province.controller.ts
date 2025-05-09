import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ProvinceService } from './province.service';
import { Province } from '../../domain/entities';
import { ControllerFactory } from '../../common/factories/controller.factory';
import {
  CreateProvinceDto,
  SerializerProvinceDto,
  SerializerShortProvinceDto,
  UpdateProvinceDto
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
import { Role } from '../../domain/enums/role.enum';
import { AuthGuard, Roles, RolesGuard } from '../auth/guards/auth.guard';

@ApiTags('Province')
@ApiExtraModels(SerializerShortProvinceDto) // Registrar el DTO en Swagger
@Controller('province')
export class ProvinceController extends ControllerFactory<
  Province,
  CreateProvinceDto,
  UpdateProvinceDto,
  SerializerProvinceDto
>(Province, CreateProvinceDto, UpdateProvinceDto, SerializerProvinceDto) {
  constructor(protected service: ProvinceService) {
    super();
  }

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('bearerAuth')
  @Get('by-country/:countryId')
  @ApiParam({ name: 'countryId', required: true, description: 'ID del país' })
  @ApiOperation({
    description: 'Obtener provincias por ID de país con paginación'
  })
  @ApiPaginationResponse(SerializerShortProvinceDto) // Aplicar el decorador ApiPaginationResponse
  async findProvincesByCountry(
    @Param('countryId') countryId: string,
    @Query() paginationDto: PaginationDto
  ) {
    const { data, meta } = await this.service.findByCountry(
      countryId,
      paginationDto
    );
    return { data: toDtoList(SerializerShortProvinceDto, data), meta }; // Asegúrate de transformar los DTOs si es necesario
  }
}
