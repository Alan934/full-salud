import { Controller, Get, Post, Put, Delete, Patch, Param, Body, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { RelatedPersonService } from './related-person.service';
import { CreateRelatedPersonDto, UpdateRelatedPersonDto, SerializerRelatedPersonDto } from '../../domain/dtos';
import { toDto } from '../../common/util/transform-dto.util';
import { Roles } from '../auth/guards/auth.guard';
import { Role } from '../../domain/enums';

@ApiTags('RelatedPerson')
@Controller('related-person')
export class RelatedPersonController {
  constructor(private readonly service: RelatedPersonService) {}

  @Roles(Role.ADMIN, Role.PRACTITIONER, Role.PATIENT)
  @Get()
  @ApiOperation({ summary: 'Obtener todas las personas relacionadas' })
  @ApiResponse({ status: 200, description: 'Personas relacionadas obtenidas', type: SerializerRelatedPersonDto, isArray: true })
  async findAll(): Promise<SerializerRelatedPersonDto[]> {
    const relatedPersons = await this.service.findAll();
    return relatedPersons.map(person => toDto(SerializerRelatedPersonDto, person));
  }

  @Roles(Role.ADMIN, Role.PRACTITIONER, Role.PATIENT)
  @Get(':id')
  @ApiOperation({ summary: 'Obtener una persona relacionada por ID' })
  @ApiParam({ name: 'id', description: 'UUID de la persona relacionada', type: String })
  @ApiResponse({ status: 200, description: 'Persona relacionada encontrada', type: SerializerRelatedPersonDto })
  async findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string): Promise<SerializerRelatedPersonDto> {
    const person = await this.service.findOne(id);
    return toDto(SerializerRelatedPersonDto, person);
  }

  @Roles(Role.ADMIN)
  @Post()
  @ApiOperation({ summary: 'Crear una nueva persona relacionada' })
  @ApiResponse({ status: 201, description: 'Persona relacionada creada', type: SerializerRelatedPersonDto })
  async create(@Body() createDto: CreateRelatedPersonDto): Promise<SerializerRelatedPersonDto> {
    const person = await this.service.create(createDto);
    return toDto(SerializerRelatedPersonDto, person);
  }

  @Roles(Role.ADMIN)
  @Put(':id')
  @ApiOperation({ summary: 'Actualizar una persona relacionada existente' })
  @ApiParam({ name: 'id', description: 'UUID de la persona relacionada', type: String })
  @ApiResponse({ status: 200, description: 'Persona relacionada actualizada', type: SerializerRelatedPersonDto })
  async update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updateDto: UpdateRelatedPersonDto
  ): Promise<SerializerRelatedPersonDto> {
    const updatedPerson = await this.service.update(id, updateDto);
    return toDto(SerializerRelatedPersonDto, updatedPerson);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una persona relacionada de forma permanente' })
  @ApiParam({ name: 'id', description: 'UUID de la persona relacionada', type: String })
  @ApiResponse({ status: 200, description: 'Persona relacionada eliminada' })
  async remove(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string): Promise<{ message: string }> {
    const message = await this.service.remove(id);
    return { message };
  }

  @Roles(Role.ADMIN)
  @Patch('soft-remove/:id')
  @ApiOperation({ summary: 'Soft delete de una persona relacionada' })
  @ApiParam({ name: 'id', description: 'UUID de la persona relacionada', type: String })
  @ApiResponse({ status: 200, description: 'Persona relacionada soft deleted' })
  async softRemove(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string): Promise<{ message: string }> {
    const message = await this.service.softRemove(id);
    return { message };
  }

  @Roles(Role.ADMIN)
  @Patch('restore/:id')
  @ApiOperation({ summary: 'Restaurar una persona relacionada soft deleted' })
  @ApiParam({ name: 'id', description: 'UUID de la persona relacionada', type: String })
  @ApiResponse({ status: 200, description: 'Persona relacionada restaurada', type: SerializerRelatedPersonDto })
  async restore(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string): Promise<SerializerRelatedPersonDto> {
    const person = await this.service.restore(id);
    return toDto(SerializerRelatedPersonDto, person);
  }
}
