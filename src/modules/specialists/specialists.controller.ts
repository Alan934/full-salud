import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { SpecialistsService } from './specialists.service';
import { Specialist, Turn } from '../../domain/entities';
import { ControllerFactory } from '../../common/factories/controller.factory';
import {
  CreateSpecialistDto,
  SerializerSpecialistDto,
  SpecialistFilteredPaginationDto,
  UpdateSpecialistDto
} from '../../domain/dtos';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiPaginationResponse } from '../../common/swagger/api-pagination-response';
import { toDtoList } from '../../common/util/transform-dto.util';
import { PaginationMetadata } from '../../common/util/pagination-data.util';
import { plainToClass } from 'class-transformer';

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

  @Post()
  @ApiOperation({
    description: 'Crear un nuevo especialista'
  })
  async create(@Body() createSpecialistDto: CreateSpecialistDto): Promise<SerializerSpecialistDto> {
    const specialist = await this.service.create(createSpecialistDto);
    
    return plainToClass(SerializerSpecialistDto, specialist);
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

  @Get('/with-turns')
  @ApiOperation({
    description: 'Get all specialists with their turns'
  })
  async findAllWithTurns(): Promise<SerializerSpecialistDto[]> {
    const specialists = await this.service.findAllWithTurns();
    return toDtoList(SerializerSpecialistDto, specialists);
  }

  // @Get('/with-turns/:id')
  // @ApiOperation({
  //   description: 'Obtener todos los turnos para un especialista específico por ID'
  // })
  // async findTurnsBySpecialistId(@Param('id') id: string): Promise<Turn[]> {
  //   return await this.service.findTurnsBySpecialistId(id);
  // }
}
