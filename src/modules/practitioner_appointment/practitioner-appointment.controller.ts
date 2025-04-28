import { Controller, Get, Param, Query } from '@nestjs/common';
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

@ApiTags('Practitioner Appointment')
@Controller('practitioner-appointment')
export class PractitionerAppointmentController extends ControllerFactory<
  PractitionerAppointment,
  CreatePractitionerAppointmentDto,
  UpdatePractitionerAppointmentDto,
  SerializerPractitionerAppointmentDto
>(
  PractitionerAppointment,
  CreatePractitionerAppointmentDto,
  UpdatePractitionerAppointmentDto,
  SerializerPractitionerAppointmentDto
) {
  constructor(protected service: PractitionerAppointmentService) {
    super();
  }

  @Roles(Role.PRACTITIONER, Role.ADMIN, Role.SECRETARY)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('bearerAuth')
  @Get("getAll")
  @ApiOperation({ summary: 'Get all practitioner appointments' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of all practitioner appointments',
    type: [SerializerPractitionerAppointmentDto]
  })
  @ApiResponse({ status: 404, description: 'No appointments found' })
  async getAll() {
    return await this.service.getAll();
  }

  @Roles(Role.PRACTITIONER, Role.ADMIN, Role.SECRETARY, Role.PATIENT)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('bearerAuth')
  @Get('getOne/:id')
  @ApiOperation({ summary: 'Get a specific practitioner appointment by ID' })
  @ApiParam({ name: 'id', description: 'Practitioner appointment ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'The requested practitioner appointment',
    type: SerializerPractitionerAppointmentDto
  })
  @ApiResponse({ status: 404, description: 'Appointment not found' })
  async getOne(@Param('id') id: string) {
    return await this.service.getOne(id);
  }

  @Get('practitioner/:practitionerId')
  @ApiOperation({ summary: 'Get all appointments for a specific practitioner' })
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

  @Roles(Role.PRACTITIONER, Role.ADMIN, Role.SECRETARY, Role.PATIENT)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('bearerAuth')
  @Get('practitioner/:practitionerId/day/:day')
  @ApiOperation({ summary: 'Get appointments for a practitioner on a specific day' })
  @ApiParam({ name: 'practitionerId', description: 'Practitioner ID' })
  @ApiParam({ 
    name: 'day', 
    description: 'Day of the week', 
    enum: Day,
    enumName: 'Day'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'List of appointments for the practitioner on the specified day',
    type: [SerializerPractitionerAppointmentDto]
  })
  @ApiResponse({ status: 404, description: 'No appointments found for this practitioner on the specified day' })
  async getByPractitionerIdAndDay(
    @Param('practitionerId') practitionerId: string,
    @Param('day') day: Day
  ) {
    return await this.service.getByPractitionerIdAndDay(practitionerId, day);
  }
}