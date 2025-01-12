import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
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

  // @Post()
  // @ApiOperation({
  //   description: 'Crear un nuevo especialista'
  // })
  // async create(@Body() createSpecialistDto: CreateSpecialistDto): Promise<SerializerSpecialistDto> {
  //   const specialist = await this.service.create(createSpecialistDto);
  //   return plainToClass(SerializerSpecialistDto, specialist);
  // }

  @Post()
  @ApiOperation({ description: 'Crear un nuevo especialista' })
  async create(@Body() createSpecialistDto: CreateSpecialistDto): Promise<SerializerSpecialistDto> {
    const specialist = await this.service.create(createSpecialistDto);
    return plainToClass(SerializerSpecialistDto, specialist);
  }

  @Get()
  @ApiOperation({ description: 'Obtener todos los especialistas' })
  async getAll(): Promise<SerializerSpecialistDto[]> {
    const specialists = await this.service.getAll();
    return plainToClass(SerializerSpecialistDto, specialists);
  }

  @Get(':id')
  @ApiOperation({ description: 'Obtener un especialista por ID' })
  async getOne(@Param('id') id: string): Promise<SerializerSpecialistDto> {
    const specialist = await this.service.getOne(id);
    return plainToClass(SerializerSpecialistDto, specialist);
  }

  @Patch(':id')
  @ApiOperation({ description: 'Actualizar un especialista' })
  async update(
    @Param('id') id: string,
    @Body() updateSpecialistDto: UpdateSpecialistDto,
  ): Promise<SerializerSpecialistDto> {
    const specialist = await this.service.update(id, updateSpecialistDto);
    return plainToClass(SerializerSpecialistDto, specialist);
  }

  @Patch('soft-delete/:id')
  @ApiOperation({ description: 'Eliminar un especialista (soft delete)' })
  async softDelete(@Param('id') id: string): Promise<{ message: string }> {
    return this.service.softDelete(id);
  }

  @Patch('recover/:id')
  @ApiOperation({ description: 'Recuperar un especialista eliminado' })
  async recover(@Param('id') id: string): Promise<{ message: string }> {
    return this.service.recover(id);
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
