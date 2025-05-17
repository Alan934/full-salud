import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { PractitionerAppointmentService } from './practitioner-appointment.service';
import { ControllerFactory } from '../../common/factories/controller.factory';
import {
  CreatePractitionerAppointmentDto,
  UpdatePractitionerAppointmentDto,
  SerializerPractitionerAppointmentDto
} from '../../domain/dtos';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { PractitionerAppointment } from '../../domain/entities';
import { Day } from '../../domain/enums';
import { Roles } from '../auth/guards/auth.guard';
import { Role } from '../../domain/enums';
import { AuthGuard, RolesGuard } from '../auth/guards/auth.guard';
import { UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { toDto, toDtoList } from '../../common/util/transform-dto.util';
import { ApiPaginationResponse } from '../../common/swagger/api-pagination-response';
import { PractitionerAppointmentFilteredPaginationDto } from '../../domain/dtos/practitioner-appointment/practitioner-appointment-filtered-pagination.dto';
import { P } from '@vercel/blob/dist/create-folder-CqdraABG.cjs';

@ApiTags('Practitioner Appointment')
@Controller('practitioner-appointment')
export class PractitionerAppointmentController {
  constructor(protected service: PractitionerAppointmentService) { }

  @Post()
  @Roles(Role.ADMIN, Role.PRACTITIONER)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('bearerAuth')
  @ApiOperation({ summary: 'Create a new practitioner appointment slot' })
  @ApiResponse({
    status: 201,
    description: 'The created practitioner appointment slot',
    type: SerializerPractitionerAppointmentDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 404, description: 'Practitioner or Location not found' })
  @ApiResponse({ status: 403, description: 'Forbidden resource' })
  async create(@Body() createDto: CreatePractitionerAppointmentDto): Promise<SerializerPractitionerAppointmentDto> {
    const entity = await this.service.create(createDto);
    return toDto(SerializerPractitionerAppointmentDto, entity);
  }

  @Get()
  @Roles(Role.PRACTITIONER, Role.ADMIN, Role.SECRETARY, Role.PATIENT)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('bearerAuth')
  @ApiOperation({
    summary: 'Get all practitioner appointment slots with optional filtering and pagination',
    description: 'Retrieve a list of practitioner appointment slots, filtered by criteria like day, time, practitioner, or location, and supports pagination.',
  })
  @ApiPaginationResponse(SerializerPractitionerAppointmentDto)
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10)' })
  @ApiQuery({ name: 'day', required: false, enum: Day, description: 'Filter by day of the week' })
  @ApiQuery({ name: 'startHour', required: false, example: '09:00', description: 'Filter by start hour (HH:mm)' })
  @ApiQuery({ name: 'endHour', required: false, example: '13:00', description: 'Filter by end hour (HH:mm)' })
  @ApiQuery({ name: 'practitionerId', required: false, type: String, description: 'Filter by Practitioner ID' })
  @ApiQuery({ name: 'locationId', required: false, type: String, description: 'Filter by Location ID' })
  async findAllPaginated(
    @Query() filterPaginationDto: PractitionerAppointmentFilteredPaginationDto,
  ): Promise<{ data: SerializerPractitionerAppointmentDto[]; lastPage: number; total: number; msg?: string }> {
    const { data, lastPage, total, msg } = await this.service.findAllPaginated(filterPaginationDto);
    const serializedData = toDtoList(SerializerPractitionerAppointmentDto, data);
    return { data: serializedData, total, lastPage, msg };
  }

  @Roles(Role.PRACTITIONER, Role.ADMIN, Role.SECRETARY, Role.PATIENT)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('bearerAuth')
  @Get(':id')
  @ApiOperation({ summary: 'Get a specific practitioner appointment by ID' })
  @ApiParam({ name: 'id', description: 'Practitioner appointment ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'The requested practitioner appointment',
    type: SerializerPractitionerAppointmentDto
  })
  @ApiResponse({ status: 404, description: 'Appointment not found' })
  async getOne(@Param('id') id: string): Promise<SerializerPractitionerAppointmentDto> {
    const entity = await this.service.getOne(id);
    return toDto(SerializerPractitionerAppointmentDto, entity);
  }

  @Get('practitioner/:practitionerId')
  @ApiOperation({ summary: 'Get all appointmentsHour for a specific practitioner' })
  @ApiParam({ name: 'practitionerId', description: 'Practitioner ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of appointments for the practitioner',
    type: [SerializerPractitionerAppointmentDto]
  })
  @ApiResponse({ status: 404, description: 'No appointments found for this practitioner' })
  async getByPractitionerId(@Param('practitionerId') practitionerId: string) {
    return await this.service.getByPractitionerId(practitionerId);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.PRACTITIONER)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('bearerAuth')
  @ApiOperation({ summary: 'Update an existing practitioner appointment slot' })
  @ApiParam({ name: 'id', description: 'ID of the practitioner appointment slot to update' })
  @ApiResponse({
    status: 200,
    description: 'The updated practitioner appointment slot',
    type: SerializerPractitionerAppointmentDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 404, description: 'Practitioner Appointment, Practitioner, or Location not found' })
   @ApiResponse({ status: 403, description: 'Forbidden resource' })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdatePractitionerAppointmentDto,
  ): Promise<SerializerPractitionerAppointmentDto> {
    const entity = await this.service.update(id, updateDto);
    return toDto(SerializerPractitionerAppointmentDto, entity);
  }

  @Patch('soft-delete/:id')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('bearerAuth')
  @ApiOperation({ summary: 'Soft delete a practitioner appointment slot' })
  @ApiParam({ name: 'id', description: 'ID of the practitioner appointment slot to soft delete' })
  @ApiResponse({
    status: 200,
    description: 'Message confirming soft deletion',
    schema: { example: { message: 'Practitioner appointment with ID "..." soft deleted successfully' } },
  })
  @ApiResponse({ status: 404, description: 'Practitioner Appointment not found' })
   @ApiResponse({ status: 403, description: 'Forbidden resource' })
  async softDelete(@Param('id') id: string): Promise<{ message: string }> {
    return this.service.softDeleted(id);
  }

  @Patch('recover/:id')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('bearerAuth')
  @ApiOperation({ summary: 'Recover a soft-deleted practitioner appointment slot' })
  @ApiParam({ name: 'id', description: 'ID of the practitioner appointment slot to recover' })
  @ApiResponse({
    status: 200,
    description: 'The recovered practitioner appointment slot',
    type: SerializerPractitionerAppointmentDto,
  })
  @ApiResponse({ status: 404, description: 'Practitioner Appointment not found' })
  @ApiResponse({ status: 400, description: 'Practitioner Appointment is not soft-deleted' })
  @ApiResponse({ status: 403, description: 'Forbidden resource' })
  async recover(@Param('id') id: string): Promise<SerializerPractitionerAppointmentDto> {
     const entity = await this.service.recover(id);
     return toDto(SerializerPractitionerAppointmentDto, entity);
  }

}