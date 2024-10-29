import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProvincesService } from './provinces.service';
import { Province } from 'src/domain/entities';
import { ControllerFactory } from 'src/common/factories/controller.factory';
import {
  CreateProvinceDto,
  SerializerProvinceDto,
  SerializerShortProvinceDto,
  UpdateProvinceDto
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

@ApiTags('Provinces')
@ApiExtraModels(SerializerShortProvinceDto) // Registrar el DTO en Swagger
@Controller('provinces')
export class ProvincesController extends ControllerFactory<
  Province,
  CreateProvinceDto,
  UpdateProvinceDto,
  SerializerProvinceDto
>(Province, CreateProvinceDto, UpdateProvinceDto, SerializerProvinceDto) {
  constructor(protected service: ProvincesService) {
    super();
  }

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
