import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ControllerFactory } from '../../common/factories/controller.factory';
import { MedicationRequest } from '../../domain/entities/MedicationRequest.entity';
import { toDto, toDtoList } from '../../common/util/transform-dto.util';
import { MedicationRequestsService } from './MedicationRequest.service';
import { SerializerMedicationRequestDto } from '../../domain/dtos/medication-request/MedicationRequest-serializer.dto';
import { CreateMedicationRequestDto, UpdateMedicationRequestDto } from '../../domain/dtos/medication-request/MedicationRequest.dto';

@ApiTags('MedicationRequests')
@Controller('MedicationRequest')
export class MedicationRequestsController extends ControllerFactory<
  MedicationRequest,
  CreateMedicationRequestDto,
  UpdateMedicationRequestDto,
  SerializerMedicationRequestDto
>(MedicationRequest, CreateMedicationRequestDto, UpdateMedicationRequestDto, SerializerMedicationRequestDto) {
  constructor(protected service: MedicationRequestsService) {
    super();
  }
  // @Post('create')
  // @ApiOperation({ summary: 'Crear una nueva receta' })
  // @ApiBody({ type: CreateMedicationRequestDto })
  // @ApiResponse({ type: SerializerMedicationRequestDto })
  // async create(
  //   @Body() createMedicationRequestDto: CreateMedicationRequestDto
  // ): Promise<SerializerMedicationRequestDto> {
  //   const data = await this.service.create(createMedicationRequestDto);
  //   return toDto(SerializerMedicationRequestDto, data);
  // }

  @Get('by-doctor')
  @ApiOperation({
    summary: 'Obtener todas las recetas asociadas a un doctor'
  })
  @ApiResponse({ type: SerializerMedicationRequestDto, isArray: true })
  async findAllMedicationRequestByDoctorId(
    @Query('doctorId') doctorId: string
  ): Promise<SerializerMedicationRequestDto[]> {
    const data = await this.service.findAllMedicationRequestByDoctorId(doctorId);
    return toDtoList(SerializerMedicationRequestDto, data);
  }

  @Get('by-patient')
  @ApiOperation({
    summary: 'Obtener todas las recetas asociadas a un paciente'
  })
  @ApiResponse({ type: SerializerMedicationRequestDto, isArray: true })
  async findAllMedicationRequestByPatientId(
    @Query('patientId') patientId: string
  ): Promise<SerializerMedicationRequestDto[]> {
    const data = await this.service.findAllMedicationRequestByPatientId(patientId);
    return toDtoList(SerializerMedicationRequestDto, data);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar una receta existente' })
  @ApiBody({ type: UpdateMedicationRequestDto })
  @ApiResponse({ type: SerializerMedicationRequestDto })
  async updateMedicationRequest(
    @Param('id') id: string,
    @Body() updateMedicationRequestDto: UpdateMedicationRequestDto
  ): Promise<SerializerMedicationRequestDto> {
    const data = await this.service.update(id, updateMedicationRequestDto);
    return toDto(SerializerMedicationRequestDto, data);
  }
}
