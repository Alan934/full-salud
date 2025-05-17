import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query,
  UseGuards
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import { MedicationService } from './medication.service';
import { CreateMedicationDto, UpdateMedicationDto, SerializerMedicationDto } from '../../domain/dtos';
import { FilteredMedicationDto } from '../../domain/dtos/medication/FilteredMedication.dto';
import { PaginationDto } from '../../common/dtos';
import { AuthGuard, Roles, RolesGuard } from '../auth/guards/auth.guard';
import { Role } from '../../domain/enums';
import { toDto } from '../../common/util/transform-dto.util';

@ApiTags('Medications')
@Controller('medications')
export class MedicationController {
  constructor(private readonly medicationService: MedicationService) {}

  @Roles(Role.ADMIN, Role.PRACTITIONER)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('bearerAuth')
  @Post('create')
  @ApiOperation({ summary: 'Crear un nuevo medicamento' })
  @ApiBody({ type: CreateMedicationDto })
  @ApiResponse({ type: SerializerMedicationDto })
  async create(
    @Body() createMedicationDto: CreateMedicationDto
  ): Promise<SerializerMedicationDto> {
    const data = await this.medicationService.create(createMedicationDto);
    return toDto(SerializerMedicationDto, data);
  }

  @Roles(Role.ADMIN, Role.PRACTITIONER)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('bearerAuth')
  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un medicamento existente' })
  @ApiParam({ name: 'id', description: 'UUID del medicamento', type: String })
  @ApiBody({ type: UpdateMedicationDto })
  @ApiResponse({ type: SerializerMedicationDto })
  async update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updateMedicationDto: UpdateMedicationDto
  ): Promise<SerializerMedicationDto> {
    const updated = await this.medicationService.update(id, updateMedicationDto);
    return toDto(SerializerMedicationDto, updated);
  }

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('bearerAuth')
  @Patch('remove/:id')
  @ApiOperation({ summary: 'Soft delete de un medicamento' })
  @ApiParam({ name: 'id', description: 'UUID del medicamento', type: String })
  @ApiResponse({
    status: 200,
    description: 'Medicamento soft deleted',
    schema: { example: { message: 'Medicamento eliminado correctamente' } }
  })
  async softRemove(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string
  ): Promise<{ message: string }> {
    const message = await this.medicationService.softRemove(id);
    return { message };
  }

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('bearerAuth')
  @Patch('restore/:id')
  @ApiOperation({ summary: 'Restaurar un medicamento soft deleted' })
  @ApiParam({ name: 'id', description: 'UUID del medicamento', type: String })
  @ApiResponse({ type: SerializerMedicationDto })
  async restore(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string
  ): Promise<SerializerMedicationDto> {
    const data = await this.medicationService.restore(id);
    return toDto(SerializerMedicationDto, data);
  }

  @Roles(Role.ADMIN, Role.PRACTITIONER, Role.PATIENT)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('bearerAuth')
  @Get(':id')
  @ApiOperation({ summary: 'Obtener un medicamento por id' })
  @ApiParam({ name: 'id', description: 'UUID del medicamento', type: String })
  @ApiResponse({ type: SerializerMedicationDto })
  async findOne(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string
  ): Promise<SerializerMedicationDto> {
    const data = await this.medicationService.findOne(id);
    return toDto(SerializerMedicationDto, data);
  }

  @Roles(Role.ADMIN, Role.PRACTITIONER, Role.PATIENT)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('bearerAuth')
  @Get()
  @ApiOperation({ summary: 'Obtener todos los medicamentos paginados' })
  @ApiQuery({ name: 'page', type: Number, required: false, example: 1, description: 'Número de página' })
  @ApiQuery({ name: 'limit', type: Number, required: false, example: 10, description: 'Límite de resultados por página' })
  @ApiResponse({ type: SerializerMedicationDto, isArray: true })
  async findAll(
    @Query() paginationDto: PaginationDto
  ): Promise<{ data: SerializerMedicationDto[]; meta: any }> {
    const { data, meta } = await this.medicationService.findAll(paginationDto);
    return { data: data.map(item => toDto(SerializerMedicationDto, item)), meta };
  }

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('bearerAuth')
  @Get('include-deletes')
  @ApiOperation({ summary: 'Obtener todos los medicamentos incluyendo eliminados' })
  @ApiQuery({ name: 'page', type: Number, required: false, example: 1, description: 'Número de página' })
  @ApiQuery({ name: 'limit', type: Number, required: false, example: 10, description: 'Límite de resultados por página' })
  @ApiResponse({ type: SerializerMedicationDto, isArray: true })
  async findAllIncludeDeletes(
    @Query() paginationDto: PaginationDto
  ): Promise<{ data: SerializerMedicationDto[]; meta: any }> {
    const { data, meta } = await this.medicationService.findAllIncludeDeletes(paginationDto);
    return { data: data.map(item => toDto(SerializerMedicationDto, item)), meta };
  }

  @Roles(Role.ADMIN, Role.PRACTITIONER, Role.PATIENT)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('bearerAuth')
  @Get('filtered')
  @ApiOperation({ summary: 'Obtener medicamentos filtrados y paginados' })
  @ApiQuery({ name: 'name', type: String, required: false, description: 'Nombre del medicamento' })
  @ApiQuery({ name: 'page', type: Number, required: false, example: 1, description: 'Número de página' })
  @ApiQuery({ name: 'limit', type: Number, required: false, example: 10, description: 'Límite de resultados por página' })
  @ApiResponse({ type: SerializerMedicationDto, isArray: true })
  async findAllFiltered(
    @Query() query: any
  ): Promise<{ data: SerializerMedicationDto[]; meta: any; msg: string }> {
    const { page = 1, limit = 10, name } = query;
    const filteredDto: FilteredMedicationDto = { name, page: Number(page), limit: Number(limit) };
    const paginationDto: PaginationDto = { page: Number(page), limit: Number(limit) };
    const { data, meta, msg } = await this.medicationService.findAllFiltered(filteredDto, paginationDto);
    return { data: data.map(item => toDto(SerializerMedicationDto, item)), meta, msg };
  }
}