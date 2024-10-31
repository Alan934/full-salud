import { Controller, Get, Query } from '@nestjs/common';
import { PatientTurnsService } from './patient_turns.service';
import { PatientTurn } from '../../domain/entities';
import { ControllerFactory } from '../../common/factories/controller.factory';
import {
  CreatePatientTurnDto,
  PatientTurnPaginationDto,
  SerializerPatientTurnDto,
  UpdatePatientTurnDto
} from '../../domain/dtos';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { toDtoList } from '../../common/util/transform-dto.util';
import { ApiPaginationResponse } from '../../common/swagger/api-pagination-response';
import { PaginationMetadata } from '../../common/util/pagination-data.util';

@ApiTags('Patient Turns')
@Controller('patient-turns')
export class PatientTurnsController extends ControllerFactory<
  PatientTurn,
  CreatePatientTurnDto,
  UpdatePatientTurnDto,
  SerializerPatientTurnDto
>(
  PatientTurn,
  CreatePatientTurnDto,
  UpdatePatientTurnDto,
  SerializerPatientTurnDto
) {
  constructor(protected service: PatientTurnsService) {
    super();
  }

  @Get()
  @ApiOperation({
    description: 'Obtener patient turns páginados con filtros opcionales'
  })
  @ApiPaginationResponse(SerializerPatientTurnDto)
  override async findAll(
    @Query() paginationDto: PatientTurnPaginationDto
  ): Promise<{ data: SerializerPatientTurnDto[]; meta: PaginationMetadata }> {
    const { data, meta } = await this.service.findAll(paginationDto);
    const serializedData = toDtoList(SerializerPatientTurnDto, data);

    return { data: serializedData, meta };
  }
}
