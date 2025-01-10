import { Body, Controller, Get, Param, ParseUUIDPipe, Post } from '@nestjs/common';
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
@Controller('patients')
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
  constructor(protected readonly service: PatientService) {
    super();
  }
  
  @Get(':id')
  async getOne(
    @Param('id', ParseUUIDPipe) id: string
  ) {
    const patient = await this.service.getOne(id);
    return patient;
  }

  @Post('/create-patient')
  async createPatient(
    @Body() createPatientDto: CreatePatientDto
  ) {
    const patient = await this.service.create(createPatientDto);
    return patient;
  }
}
