import {
  Body,
  Controller,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Get,
  Query,
  BadRequestException,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import 'multer';
import { AppointmentService } from './appointment.service';
import {
  CreateAppointmentDto,
  SerializerAppointmentDto,
  UpdateAppointmentDto
} from '../../domain/dtos';
import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiCreatedResponse,
  ApiParam,
  ApiBearerAuth,
  ApiQuery
} from '@nestjs/swagger';
import { toDto } from '../../common/util/transform-dto.util';
import { AuthGuard, Roles, RolesGuard } from '../auth/guards/auth.guard';
import { Role } from '../../domain/enums';
import { ControllerFactory } from '../../common/factories/controller.factory';
import { Appointment } from '../../domain/entities';
import { ApiPaginationResponse } from '../../common/swagger/api-pagination-response';

@ApiTags('Appointment')
@Controller('appointment')
@ApiBearerAuth('bearerAuth')
export class AppointmentController  {
  constructor(protected service: AppointmentService) {
  }

  @Get('patient/:dni/practitioner/:practitionerId')
  @ApiOperation({
    summary: 'Get all appointments for a patient by DNI and practitioner ID',
    description: 'Retrieve all appointments from today onwards for a specific patient and practitioner'
  })
  @ApiParam({
    name: 'dni',
    description: 'Patient DNI',
    type: String,
    example: '12345678'
  })
  @ApiParam({
    name: 'practitionerId',
    description: 'Practitioner ID (UUID)',
    type: String,
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @ApiResponse({
    status: 200,
    description: 'List of appointments found',
    type: [SerializerAppointmentDto]
  })
  @ApiResponse({
    status: 404,
    description: 'No appointments found for the given DNI and practitioner'
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden resource'
  })
  async getTurnsByDniAndPractitioner(
    @Param('dni') dni: string,
    @Param('practitionerId', new ParseUUIDPipe()) practitionerId: string
  ): Promise<SerializerAppointmentDto[]> {
    const turns = await this.service.getTurnsByDniAndPractitioner(dni, practitionerId);
    return turns.map(turn => toDto(SerializerAppointmentDto, turn));
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new appointment',
    description: 'Creates a new appointment and associates it with a patient and practitioners'
  })
  @ApiBody({
    type: CreateAppointmentDto,
    description: 'Appointment creation data'
  })
  @ApiResponse({
    status: 201,
    description: 'The appointment has been successfully created',
    type: SerializerAppointmentDto
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data or appointment overlap'
  })
  @ApiResponse({
    status: 404,
    description: 'Patient or Practitioner not found'
  })
  async createTurnWithPatient(
    @Body() createTurnDto: CreateAppointmentDto
  ): Promise<SerializerAppointmentDto> {
    const turn = await this.service.createTurn(createTurnDto);
    return toDto(SerializerAppointmentDto, turn);
  }

  @Get()
  @Roles(Role.PRACTITIONER, Role.ADMIN, Role.SECRETARY, Role.PATIENT)
  @ApiBearerAuth('bearerAuth')
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Get all appointments with pagination',
    description: 'Retrieves a paginated list of all appointments'
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (default: 1)'
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page (default: 10)'
  })
  @ApiPaginationResponse(SerializerAppointmentDto)
  async getAllTurns(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10'
  ): Promise<{
    total: number;
    page: number;
    limit: number;
    previousPage: number | null;
    turns: SerializerAppointmentDto[]
  }> {
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const { turns, total, previousPage } = await this.service.getAll(
      pageNumber,
      limitNumber
    );
    return {
      turns: turns.map((turn) => toDto(SerializerAppointmentDto, turn)),
      total,
      page: pageNumber,
      limit: limitNumber,
      previousPage,
    };
  }

  @Get(':id')
  @ApiOperation({ description: 'Obtener un turno por su ID' })
  @ApiParam({ name: 'id', description: 'UUID del turno', type: String })
  @ApiResponse({ status: 200, description: 'Turno encontrado', type: SerializerAppointmentDto })
  @ApiResponse({ status: 404, description: 'Turno no encontrado' })
  async getTurnById(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string
  ): Promise<SerializerAppointmentDto> {
    const turn = await this.service.getOne(id);
    return toDto(SerializerAppointmentDto, turn);
  }

  @Get('specialist/:specialistId')
  @ApiOperation({ 
    description: 'Obtener todos los turnos futuros (hasta 6 meses) de un practitioner por estado PENDING, APPROVED, NO_SHOW' 
  })
  @ApiParam({ name: 'practitionerId', description: 'UUID del practitioner', type: String })
  @ApiResponse({ 
    status: 200, 
    description: 'Turnos encontrados', 
    type: [SerializerAppointmentDto] 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'No se encontraron turnos para el practitioner' 
  })
  async getTurnsBySpecialist(
    @Param('specialistId', new ParseUUIDPipe({ version: '4' })) specialistId: string
  ): Promise<SerializerAppointmentDto[]> {
    const turns = await this.service.getTurnsBySpecialist(specialistId);
    return turns.map(turn => toDto(SerializerAppointmentDto, turn));
  }

  @Roles(Role.PRACTITIONER, Role.ADMIN, Role.PATIENT)
  @UseGuards(AuthGuard, RolesGuard)
  @Get('specialist-all/:specialistId')
  @ApiBearerAuth('bearerAuth')
  @ApiOperation({ description: 'Obtener turnos por el ID de un especialista con paginación, exluyendo estado no_show' })
  @ApiParam({ name: 'specialistId', description: 'UUID del especialista', type: String })
  @ApiResponse({ status: 200, description: 'Turnos encontrados', type: [SerializerAppointmentDto] })
  @ApiResponse({ status: 404, description: 'No se encontraron turnos para el especialista' })
  async getTurnsBySpecialistAll(
    @Param('specialistId', new ParseUUIDPipe({ version: '4' })) specialistId: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10'
  ): Promise<{
    total: number;
    page: number;
    limit: number;
    previousPage: number | null;
    turns: SerializerAppointmentDto[]
  }> {
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const { turns, total, previousPage } = await this.service.getTurnsBySpecialistAll(specialistId, pageNumber, limitNumber);
    return {
      turns: turns.map((turn) => toDto(SerializerAppointmentDto, turn)),
      total,
      page: pageNumber,
      limit: limitNumber,
      previousPage,
    };
  }

  @Roles(Role.PRACTITIONER, Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Get('stats/:specialistId')
  @ApiBearerAuth('bearerAuth')
  @ApiOperation({ description: 'Obtener estadísticas de turnos para un especialista, filtradas por periodo (opcional: week omonth o year)' })
  @ApiParam({ name: 'specialistId', description: 'UUID del especialista', type: String })
  @ApiResponse({
    status: 200,
    description: 'Estadísticas de turnos obtenidas correctamente',
    schema: {
      example: {
        completedStats: { count: 10, percentage: 50 },
        canceledStats: { count: 10, percentage: 50 },
        totalTurns: 20,
        period: { start: '2024-03-01', end: '2024-04-01' }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'No se encontraron turnos para el especialista en el periodo indicado' })
  async getTurnStatsForSpecialist(
    @Param('specialistId', new ParseUUIDPipe({ version: '4' })) specialistId: string,
    @Query('period') period?: 'month' | 'year'
  ): Promise<{
    completedStats: { count: number; percentage: number };
    canceledStats: { count: number; percentage: number };
    totalTurns: number;
    period?: { start: string; end: string };
  }> {
    const stats = await this.service.getTurnStatsForSpecialist(specialistId, period);
    return stats;
  }

  @Roles(Role.PRACTITIONER, Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Get('patient/:patientId')
  @ApiBearerAuth('bearerAuth')
  @ApiOperation({ description: 'Obtener turnos por el ID de un paciente con paginación' })
  @ApiParam({ name: 'patientId', description: 'UUID del paciente', type: String })
  @ApiResponse({ status: 200, description: 'Turnos encontrados', type: [SerializerAppointmentDto] })
  @ApiResponse({ status: 404, description: 'No se encontraron turnos para el paciente' })
  async getTurnsByPatient(
    @Param('patientId', new ParseUUIDPipe({ version: '4' })) patientId: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10'
  ): Promise<{
    total: number;
    page: number;
    limit: number;
    previousPage: number | null;
    turns: SerializerAppointmentDto[]
  }> {
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const { turns, total, previousPage } = await this.service.getTurnsByPatient(patientId, pageNumber, limitNumber);
    return {
      turns: turns.map((turn) => toDto(SerializerAppointmentDto, turn)),
      total,
      page: pageNumber,
      limit: limitNumber,
      previousPage,
    };
  }

  @Roles(Role.PRACTITIONER, Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Get('patient-all/:patientId')
  @ApiBearerAuth('bearerAuth')
  @ApiOperation({ description: 'Obtener turnos por el ID de un paciente con paginación, exluyendo estado no_show' })
  @ApiParam({ name: 'patientId', description: 'UUID del paciente', type: String })
  @ApiResponse({ status: 200, description: 'Turnos encontrados', type: [SerializerAppointmentDto] })
  @ApiResponse({ status: 404, description: 'No se encontraron turnos para el paciente' })
  async getTurnsByPatientAll(
    @Param('patientId', new ParseUUIDPipe({ version: '4' })) patientId: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10'
  ): Promise<{
    total: number;
    page: number;
    limit: number;
    previousPage: number | null;
    turns: SerializerAppointmentDto[]
  }> {
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const { turns, total, previousPage } = await this.service.getTurnsByPatientAll(patientId, pageNumber, limitNumber);
    return {
      turns: turns.map((turn) => toDto(SerializerAppointmentDto, turn)),
      total,
      page: pageNumber,
      limit: limitNumber,
      previousPage,
    };
  }

  @Roles(Role.PRACTITIONER, Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Get('completed/patient/:patientId')
  @ApiBearerAuth('bearerAuth')
  @ApiOperation({ description: 'Obtener turnos completados por el ID de un paciente con paginación' })
  @ApiParam({ name: 'patientId', description: 'UUID del paciente', type: String })
  @ApiResponse({ status: 200, description: 'Turnos completados encontrados', type: [SerializerAppointmentDto] })
  @ApiResponse({ status: 404, description: 'No se encontraron turnos completados para el paciente' })
  async getCompletedTurnsByPatient(
    @Param('patientId', new ParseUUIDPipe({ version: '4' })) patientId: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10'
  ): Promise<{
    total: number;
    page: number;
    limit: number;
    previousPage: number | null;
    turns: SerializerAppointmentDto[]
  }> {
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const { turns, total, previousPage } = await this.service.getCompletedTurnsByPatient(patientId, pageNumber, limitNumber);
    return {
      turns: turns.map((turn) => toDto(SerializerAppointmentDto, turn)),
      total,
      page: pageNumber,
      limit: limitNumber,
      previousPage,
    };
  }

  @Patch('/cancel/:id')
  @ApiOperation({ description: 'Eliminar (soft delete) un turno' })
  @ApiParam({ name: 'id', description: 'UUID del turno', type: String })
  @ApiResponse({ status: 200, description: 'Turno eliminado correctamente', schema: { example: { message: 'Turn deleted successfully', deletedTurn: { /* ejemplo del turno */ } } } })
  @ApiResponse({ status: 404, description: 'Turno no encontrado' })
  async removeTurn(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<{ message: string }> {
    return this.service.removeTurn(id, null);
  }

  @Patch('/reprogram/:id')
  @ApiOperation({ description: 'Reprogramar un turno' })
  @ApiParam({ name: 'id', description: 'UUID del turno', type: String })
  @ApiResponse({ status: 200, description: 'Turno eliminado correctamente' })
  @ApiResponse({ status: 404, description: 'Turno no encontrado' })
  async reprogramTurn(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<{ turn: SerializerAppointmentDto }> {
    const turn = await this.service.reprogramTurn(id);
    return { turn: toDto(SerializerAppointmentDto, turn) };
  }

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Patch('/recover/:id')
  @ApiBearerAuth('bearerAuth')
  @ApiOperation({ description: 'Recuperar un turno eliminado' })
  @ApiParam({ name: 'id', description: 'UUID del turno', type: String })
  @ApiResponse({ status: 200, description: 'Turno recuperado correctamente', type: SerializerAppointmentDto })
  @ApiResponse({ status: 404, description: 'Turno no encontrado' })
  async recoverTurn(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<SerializerAppointmentDto> {
    const turn = await this.service.recoverTurn(id);
    return toDto(SerializerAppointmentDto, turn);
  }

  @Patch(':id')
  @ApiOperation({ description: 'Actualizar un turno' })
  @ApiParam({ name: 'id', description: 'UUID del turno', type: String })
  @ApiBody({ type: UpdateAppointmentDto })
  @ApiResponse({ status: 200, description: 'Turno actualizado correctamente', type: SerializerAppointmentDto })
  @ApiResponse({ status: 404, description: 'Turno no encontrado' })
  async updateTurn(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updateTurnDto: UpdateAppointmentDto,
  ): Promise<SerializerAppointmentDto> {
    const turn = await this.service.updateTurn(id, updateTurnDto);
    return toDto(SerializerAppointmentDto, turn);
  }

  @Roles(Role.PRACTITIONER, Role.ADMIN, Role.PATIENT)
  @UseGuards(AuthGuard, RolesGuard)
  @Patch('check-overlap/:id')
  @ApiBearerAuth('bearerAuth')
  @ApiOperation({ description: 'Verificar superposición y actualizar un turno' })
  @ApiParam({ name: 'id', description: 'UUID del turno', type: String })
  @ApiBody({ type: UpdateAppointmentDto })
  @ApiResponse({ status: 200, description: 'Turno actualizado correctamente', type: SerializerAppointmentDto })
  @ApiResponse({ status: 400, description: 'Superposición de turnos o datos inválidos' })
  @ApiResponse({ status: 404, description: 'Turno no encontrado' })
  async checkOverlapAndUpdateTurn(
    @Param('id') id: string,
    @Body() updateTurnDto: UpdateAppointmentDto,
  ): Promise<SerializerAppointmentDto> {
    try {
      const updatedTurn = await this.service.checkOverlapAndUpdateTurn(id, updateTurnDto);
      return updatedTurn;
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to update turn');
    }
  }
}