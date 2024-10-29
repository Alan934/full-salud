import { Controller, Get, Query } from '@nestjs/common';
import { InstitutionsService } from './institutions.service';
import { Institution } from 'src/domain/entities';
import { ControllerFactory } from 'src/common/factories/controller.factory';
import {
  CreateInstitutionDto,
  SerializerInstitutionDto,
  UpdateInstitutionDto
} from 'src/domain/dtos';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiPaginationResponse } from 'src/common/swagger/api-pagination-response';
import { InstitutionPaginationDto } from 'src/domain/dtos/institution/institution-filtered-pagination.dto';
import { toDtoList } from 'src/common/util/transform-dto.util';
import { PaginationMetadata } from 'src/common/util/pagination-data.util';

@ApiTags('Institutions')
@Controller('institutions')
export class InstitutionsController extends ControllerFactory<
  Institution,
  CreateInstitutionDto,
  UpdateInstitutionDto,
  SerializerInstitutionDto
>(
  Institution,
  CreateInstitutionDto,
  UpdateInstitutionDto,
  SerializerInstitutionDto
) {
  constructor(protected service: InstitutionsService) {
    super();
  }

  @Get()
  @ApiOperation({
    description: 'Obtener institutions con filtros opcionales con paginación'
  })
  @ApiPaginationResponse(SerializerInstitutionDto)
  override async findAll(
    @Query() paginationDto: InstitutionPaginationDto
  ): Promise<{ data: SerializerInstitutionDto[]; meta: PaginationMetadata }> {
    const { data, meta } = await this.service.findAll(paginationDto);
    const serializedData = toDtoList(SerializerInstitutionDto, data);

    return { data: serializedData, meta };
  }
}
