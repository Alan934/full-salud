import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { PatientService } from './patients.service';
import { ControllerFactory } from '../../common/factories/controller.factory';
import { Patient } from '../../domain/entities';
import {
  CreatePatientDto,
  SerializerPatientDto,
  UpdatePatientDto
} from '../../domain/dtos';
import { ApiTags } from '@nestjs/swagger';

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

  @Get()
  async getAll() {
    return await this.patientService.getAll();
  }

  @Get(':id')
  async getOnePatient(@Param('id') id: string) {
    return await this.patientService.getOne(id);
  }

  @Patch(':id')
  async updatePatient(@Param('id') id: string, @Body() updatePatientDto: UpdatePatientDto) {
    return await this.patientService.update(id, updatePatientDto);
  }

  @Delete(':id')
  async softDelete(@Param('id') id: string) {
    return await this.patientService.softDelete(id);
  }

  @Post('/recover/:id')
  async recover(@Param('id') id: string) {
    return await this.patientService.recover(id);
  }

  // @Post('/create-patient')
  // async createPatient(
  //   @Body() createPatientDto: CreatePatientDto
  // ) {
  //   const patient = await this.service.create(createPatientDto);
  //   return patient;
  // }
}
