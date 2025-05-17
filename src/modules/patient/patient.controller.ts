import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { PatientService } from './patient.service';
import { ControllerFactory } from '../../common/factories/controller.factory';
import { Patient } from '../../domain/entities';
import {
  CreatePatientDto,
  SerializerPatientDto,
  UpdatePatientDto
} from '../../domain/dtos';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard, Roles, RolesGuard } from '../auth/guards/auth.guard';
import { Role, DocumentType } from '../../domain/enums';
import { toDto } from '../../common/util/transform-dto.util';

@ApiTags('Patient')
@Controller('patient')
export class PatientController {
  constructor(protected readonly patientService: PatientService) {
  }

  @Post()
  @ApiOperation({ description: 'Crear un Paciente' })
  // @ApiCreatedResponse({
  //   description: 'Paciente creado exitosamente con un paciente asociado',
  //   type: SerializerPatientDto,
  // })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 404, description: 'Paciente no encontrado' })
  async createPatient(@Body() createPatientDto: CreatePatientDto) {
    return await this.patientService.createPatient(createPatientDto);
  }

  @Roles(Role.PRACTITIONER, Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('bearerAuth')
  @Get()
  async getAll(@Query('page') page: string = '1',
  @Query('limit') limit: string = '10'): 
  Promise<{ total: number; page: number; limit: number; patients: SerializerPatientDto[] }> {
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const { patients, total } = await this.patientService.getAll(pageNumber, limitNumber);
    return { patients: patients.map((patient) => toDto(SerializerPatientDto, patient)), total, page: pageNumber, limit: limitNumber };
  }

  @Roles(Role.PRACTITIONER, Role.ADMIN, Role.PATIENT)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('bearerAuth')
  @Get(':id')
  async getOnePatient(@Param('id') id: string) {
    return await this.patientService.getOne(id);
  }

  @Roles(Role.PRACTITIONER, Role.ADMIN, Role.PATIENT)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('bearerAuth')
  @Patch(':id')
  async updatePatient(@Param('id') id: string, @Body() updatePatientDto: UpdatePatientDto) {
    return await this.patientService.update(id, updatePatientDto);
  }

  @Roles(Role.PRACTITIONER, Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('bearerAuth')
  @Delete(':id')
  async softDelete(@Param('id') id: string) {
    return await this.patientService.softDelete(id);
  }

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('bearerAuth')
  @Post('/recover/:id')
  async recover(@Param('id') id: string) {
    return await this.patientService.recover(id);
  }

  @Roles(Role.PRACTITIONER, Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('bearerAuth')
  @Get('document/:type/:number')
  @ApiOperation({ description: 'Get patient by document type and number' })
  @ApiResponse({ 
    status: 200, 
    description: 'Patient found',
    type: SerializerPatientDto 
  })
  @ApiResponse({ status: 400, description: 'Invalid document format' })
  @ApiResponse({ status: 404, description: 'Patient not found' })
  async getPatientByDocument(
    @Param('type') type: DocumentType,
    @Param('number') number: string
  ) {
    return await this.patientService.getByDocument(type, number);
  }
}
