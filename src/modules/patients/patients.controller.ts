import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { PatientService } from './patients.service';
import { ControllerFactory } from '../../common/factories/controller.factory';
import { Patient } from '../../domain/entities';
import {
  CreatePatientDto,
  SerializerPatientDto,
  UpdatePatientDto
} from '../../domain/dtos';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard, Roles, RolesGuard } from '../auth/guards/auth.guard';
import { Role } from '../../domain/enums/role.enum';
import { toDtoList } from '../../common/util/transform-dto.util';

@ApiTags('Patients')
@Controller('patient')
export class PatientController extends ControllerFactory<
  Patient,
  CreatePatientDto,
  UpdatePatientDto,
  SerializerPatientDto
>(
  Patient,
  CreatePatientDto,
  UpdatePatientDto,
  SerializerPatientDto
) {
  constructor(protected readonly patientService: PatientService) {
    super();
  }

  @Post()
  async createPatient(@Body() createPatientDto: CreatePatientDto) {
    return await this.patientService.createPatient(createPatientDto);
  }

  @Roles(Role.SPECIALIST, Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Get()
  async getAll() {
    const data = await this.patientService.getAll();
    return toDtoList(SerializerPatientDto, data);
  }

  @Roles(Role.SPECIALIST, Role.ADMIN, Role.PATIENT)
  @UseGuards(AuthGuard, RolesGuard)
  @Get(':id')
  async getOnePatient(@Param('id') id: string) {
    return await this.patientService.getOne(id);
  }

  @Roles(Role.SPECIALIST, Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Patch(':id')
  async updatePatient(@Param('id') id: string, @Body() updatePatientDto: UpdatePatientDto) {
    return await this.patientService.update(id, updatePatientDto);
  }

  @Roles(Role.SPECIALIST, Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Delete(':id')
  async softDelete(@Param('id') id: string) {
    return await this.patientService.softDelete(id);
  }

  @Roles(Role.SPECIALIST, Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Post('/recover/:id')
  async recover(@Param('id') id: string) {
    return await this.patientService.recover(id);
  }
}
