import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard, Roles, RolesGuard } from '../auth/guards/auth.guard';
import { PractitionerService } from './practitioner.service';
import { Practitioner, Appointment } from '../../domain/entities';
import { ControllerFactory } from '../../common/factories/controller.factory';
import { CreatePractitionerDto, PractitionerByNameAndLicenseDto, UpdatePractitionerDto, ValidatePractitionerSisaDto } from '../../domain/dtos/practitioner/practitioner.dto';
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ApiPaginationResponse } from '../../common/swagger/api-pagination-response';
import { toDto, toDtoList } from '../../common/util/transform-dto.util';
import { PaginationMetadata } from '../../common/util/pagination-data.util';
import { plainToClass } from 'class-transformer';
import { SerializerPractitionerDto } from '../../domain/dtos/practitioner/practitioner-serializer.dto';
import { PractitionerFilteredPaginationDto } from '../../domain/dtos/practitioner/practitioner-filtered-pagination.dto';
import { SerializerShortPractitionerRoleDto } from '../../domain/dtos';
import { PractitionerFilteredDto } from '../../domain/dtos/practitioner/practitioner-filterd.dto';
import { Role } from '../../domain/enums';

@ApiTags('Practitioner')
@Controller('practitioner')
export class PractitionerController {
  constructor(protected service: PractitionerService) { }

  @Roles(Role.PRACTITIONER, Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('bearerAuth')
  @Post()
  @ApiOperation({ description: 'Crear un nuevo especialista' })
  async create(@Body() createSpecialistDto: CreatePractitionerDto) {
    const practitioner = await this.service.createSpecialist(createSpecialistDto);
    return practitioner;
  }

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('bearerAuth')
  @Post('validate-sisa')
  @ApiOperation({ description: 'Validar un profesional en el sistema SISA' })
  @ApiResponse({ 
    status: 200, 
    description: 'Devuelve si el profesional es válido según SISA',
    schema: {
      type: 'object',
      properties: {
        isValid: { type: 'boolean' },
        message: { type: 'string' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Error en la validación' })
  async validateInSisa(@Body() validateDto: ValidatePractitionerSisaDto): Promise<{ isValid: boolean, message: string }> {
    try {
      const isValid = await this.service.validatePractitionerInSisa(validateDto.dni, validateDto.license);
      return { 
        isValid, 
        message: 'Professional is valid in SISA' 
      };
    } catch (error) {
      return {
        isValid: false,
        message: 'Error validating professional in SISA: '+ error,
      };
    }
  }

  @Get(':id')
  @ApiOperation({ description: 'Get a practitioner by ID' })
  async getOne(@Param('id') id: string): Promise<SerializerPractitionerDto> {
    const practitioner = await this.service.getOne(id);
    return plainToClass(SerializerPractitionerDto, practitioner);
  }

  @Get('search/by-name-license')
  @ApiOperation({ 
    description: 'Buscar médicos por nombre y/o matrícula',
    summary: 'Permite buscar médicos combinando nombre (parcial) y matrícula (exacta)'
  })
  async findByNameAndLicense(
    @Query() filterDto: PractitionerByNameAndLicenseDto
  ): Promise<SerializerPractitionerDto> {
    const practitioner = await this.service.findByNameAndLicense(filterDto);
    return toDto(SerializerPractitionerDto, practitioner);
  }

  @Roles(Role.PRACTITIONER, Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('bearerAuth')
  @Patch(':id')
  @ApiOperation({ description: 'Update a practitioner' })
  async update(
    @Param('id') id: string,
    @Body() updateSpecialistDto: UpdatePractitionerDto,
  ): Promise<SerializerPractitionerDto> {
    const practitioner = await this.service.update(id, updateSpecialistDto);
    return plainToClass(SerializerPractitionerDto, practitioner);
  }

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('bearerAuth')
  @Patch('soft-delete/:id')
  @ApiOperation({ description: 'Eliminar un practitioner (soft delete)' })
  async softDelete(@Param('id') id: string): Promise<{ message: string }> {
    return this.service.softDelete(id);
  }

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('bearerAuth')
  @Patch('recover/:id')
  @ApiOperation({ description: 'Recuperar un practitioner eliminado' })
  async recover(@Param('id') id: string): Promise<{ message: string }> {
    return this.service.recover(id);
  }

  @Roles(Role.PRACTITIONER, Role.ADMIN, Role.PATIENT, Role.SECRETARY)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('bearerAuth')
  @Get('search/all')
  @ApiOperation({
    summary: 'Búsqueda avanzada de profesionales',
    description: 'Obtiene todos los profesionales con filtros avanzados y paginación'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de profesionales filtrada',
    type: SerializerPractitionerDto,
    isArray: true 
  })
  async practitionerPaginationAll(
    @Query() filters: PractitionerFilteredPaginationDto
  ) {
    const result = await this.service.practitionerPaginationAll(filters);
    return {
      ...result,
      data: toDtoList(SerializerPractitionerDto, result.data)
    };
  }

  @Roles(Role.PRACTITIONER, Role.ADMIN,Role.PATIENT, Role.SECRETARY)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('bearerAuth')
  @Get('/with-turns')
  @ApiOperation({
    description: 'Get all practitioner with their turns'
  })
  async findAllWithTurns(): Promise<SerializerPractitionerDto[]> {
    const specialists = await this.service.findAllWithTurns();
    return toDtoList(SerializerPractitionerDto, specialists);
  }

}
