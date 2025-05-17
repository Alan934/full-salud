import { Controller, Get, Post, Put, Delete, Patch, Param, Body, Query, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { AppointmentSlotService } from './appointment-slot.service';
import { AppointmentSlot } from '../../domain/entities';
import { ControllerFactory } from '../../common/factories/controller.factory';
import { CreateAppointmentSlotDto, UpdateAppointmentSlotDto, SerializerAppointmentSlotDto } from '../../domain/dtos';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { toDto, toDtoList } from '../../common/util/transform-dto.util';
import { PaginationMetadata } from '../../common/util/pagination-data.util';
import { FilteredAppointmentSlotDto } from '../../domain/dtos/appointment-slot/FilteredAppointmentSlot.dto';
import { PaginationDto } from '../../common/dtos';
import {  AuthGuard, Roles, RolesGuard } from '../auth/guards/auth.guard';
import { Role } from '../../domain/enums';

@ApiTags('AppointmentSlot')
@Controller('appointment-slot')
export class AppointmentSlotController extends ControllerFactory<
  AppointmentSlot,
  CreateAppointmentSlotDto,
  UpdateAppointmentSlotDto,
  SerializerAppointmentSlotDto
>(
  AppointmentSlot,
  CreateAppointmentSlotDto,
  UpdateAppointmentSlotDto,
  SerializerAppointmentSlotDto
) {
  constructor(protected service: AppointmentSlotService) {
    super();
  }

  @Roles(Role.ADMIN, Role.PRACTITIONER, Role.PATIENT)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('bearerAuth')
  @Get()
  @ApiOperation({ summary: 'Obtener todos los appointment slots paginados' })
  @ApiQuery({ name: 'page', type: Number, required: false, example: 1, description: 'Número de página' })
  @ApiQuery({ name: 'limit', type: Number, required: false, example: 10, description: 'Límite de resultados por página' })
  @ApiResponse({ status: 200, description: 'Appointment slots obtenidos', type: SerializerAppointmentSlotDto, isArray: true })
  async findAll(
    @Query() paginationDto: PaginationDto
  ): Promise<{ data: SerializerAppointmentSlotDto[]; meta: PaginationMetadata }> {
    const { data, meta } = await this.service.findAll(paginationDto);
    return { data: toDtoList(SerializerAppointmentSlotDto, data), meta };
  }

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('bearerAuth')
  @Get('include-deletes')
  @ApiOperation({ summary: 'Obtener todos los appointment slots incluyendo eliminados' })
  @ApiQuery({ name: 'page', type: Number, required: false, example: 1, description: 'Número de página' })
  @ApiQuery({ name: 'limit', type: Number, required: false, example: 10, description: 'Límite de resultados por página' })
  @ApiResponse({ status: 200, description: 'Appointment slots obtenidos', type: SerializerAppointmentSlotDto, isArray: true })
  async findAllIncludeDeletes(
    @Query() paginationDto: PaginationDto
  ): Promise<{ data: SerializerAppointmentSlotDto[]; meta: PaginationMetadata }> {
    const { data, meta } = await this.service.findAllIncludeDeletes(paginationDto);
    return { data: toDtoList(SerializerAppointmentSlotDto, data), meta };
  }

  @Roles(Role.ADMIN, Role.PRACTITIONER, Role.PATIENT)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('bearerAuth')
  @Get('filtered')
  @ApiOperation({ summary: 'Obtener appointment slots filtrados y paginados' })
  @ApiQuery({ name: 'day', type: String, required: false, description: 'Día de la semana' })
  @ApiQuery({ name: 'openingHour', type: String, required: false, description: 'Hora de apertura' })
  @ApiQuery({ name: 'closeHour', type: String, required: false, description: 'Hora de cierre' })
  @ApiQuery({ name: 'page', type: Number, required: false, example: 1, description: 'Número de página' })
  @ApiQuery({ name: 'limit', type: Number, required: false, example: 10, description: 'Límite de resultados por página' })
  @ApiResponse({ status: 200, description: 'Appointment slots filtrados obtenidos', type: SerializerAppointmentSlotDto, isArray: true })
  async findAllFiltered(
    @Query() query: any
  ): Promise<{ data: SerializerAppointmentSlotDto[]; meta: PaginationMetadata; msg: string }> {
    const { page = 1, limit = 10, day, openingHour, closeHour } = query;
    const filteredDto: FilteredAppointmentSlotDto = { day, openingHour, closeHour, page: Number(page), limit: Number(limit) };
    const paginationDto: PaginationDto = { page: Number(page), limit: Number(limit) };
    const { data, meta, msg } = await this.service.findAllFiltered(filteredDto, paginationDto);
    return { data: toDtoList(SerializerAppointmentSlotDto, data), meta, msg };
  }

  @Roles(Role.ADMIN, Role.PRACTITIONER, Role.PATIENT)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('bearerAuth')
  @Get(':id')
  @ApiOperation({ summary: 'Obtener un appointment slot por id' })
  @ApiParam({ name: 'id', description: 'UUID del appointment slot', type: String })
  @ApiResponse({ status: 200, description: 'Appointment slot encontrado', type: SerializerAppointmentSlotDto })
  async findOne(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string
  ): Promise<SerializerAppointmentSlotDto> {
    const slot = await this.service.findOne(id);
    return toDto(SerializerAppointmentSlotDto, slot);
  }

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('bearerAuth')
  @Post()
  @ApiOperation({ summary: 'Crear un nuevo appointment slot' })
  @ApiResponse({ status: 201, description: 'Appointment slot creado', type: SerializerAppointmentSlotDto })
  async create(@Body() createDto: CreateAppointmentSlotDto): Promise<SerializerAppointmentSlotDto> {
    const slot = await this.service.create(createDto);
    return toDto(SerializerAppointmentSlotDto, slot);
  }

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('bearerAuth')
  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un appointment slot existente' })
  @ApiParam({ name: 'id', description: 'UUID del appointment slot', type: String })
  @ApiResponse({ status: 200, description: 'Appointment slot actualizado', type: SerializerAppointmentSlotDto })
  async update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updateDto: UpdateAppointmentSlotDto
  ): Promise<SerializerAppointmentSlotDto> {
    const updated = await this.service.update(id, updateDto);
    return toDto(SerializerAppointmentSlotDto, updated);
  }

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('bearerAuth')
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un appointment slot de forma permanente' })
  @ApiParam({ name: 'id', description: 'UUID del appointment slot', type: String })
  @ApiResponse({ status: 200, description: 'Appointment slot eliminado' })
  async remove(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string
  ): Promise<string> {
    return await this.service.remove(id);
  }

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('bearerAuth')
  @Patch('soft-remove/:id')
  @ApiOperation({ summary: 'Soft delete de un appointment slot' })
  @ApiParam({ name: 'id', description: 'UUID del appointment slot', type: String })
  @ApiResponse({ status: 200, description: 'Appointment slot soft deleted' })
  async softRemove(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string
  ): Promise<string> {
    return await this.service.softRemove(id);
  }

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('bearerAuth')
  @Patch('restore/:id')
  @ApiOperation({ summary: 'Restaurar un appointment slot soft deleted' })
  @ApiParam({ name: 'id', description: 'UUID del appointment slot', type: String })
  @ApiResponse({ status: 200, description: 'Appointment slot restaurado', type: SerializerAppointmentSlotDto })
  async restore(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string
  ): Promise<SerializerAppointmentSlotDto> {
    const slot = await this.service.restore(id);
    return toDto(SerializerAppointmentSlotDto, slot);
  }
}