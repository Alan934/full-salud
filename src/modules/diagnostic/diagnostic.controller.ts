import { Controller, Get, Post, Put, Delete, Patch, Param, Body, ParseUUIDPipe, UseGuards, Query } from '@nestjs/common';
import { DiagnosticService } from './diagnostic.service';
import { Diagnostic } from '../../domain/entities';
import { CreateDiagnosticDto, UpdateDiagnosticDto, SerializerDiagnosticDto } from '../../domain/dtos';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { toDto } from '../../common/util/transform-dto.util';
import { AuthGuard, Roles, RolesGuard } from '../auth/guards/auth.guard';
import { Role } from '../../domain/enums';
import { PaginationDto } from '../../common/dtos';

@ApiTags('Diagnostic')
@ApiBearerAuth('bearerAuth')
@UseGuards(AuthGuard, RolesGuard)
@Controller('diagnostic')
export class DiagnosticController {
  constructor(private readonly diagnosticService: DiagnosticService) {}

  @Roles(Role.ADMIN, Role.PRACTITIONER, Role.PATIENT)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('bearerAuth')
  @Get()
  @ApiOperation({ summary: 'Obtener todos los diagnósticos' })
  @ApiResponse({ status: 200, description: 'Diagnósticos obtenidos', type: SerializerDiagnosticDto, isArray: true })
  async findAll(): Promise<SerializerDiagnosticDto[]> {
    const diagnostics = await this.diagnosticService.findAll();
    return diagnostics.map(d => toDto(SerializerDiagnosticDto, d));
  }

  @Roles(Role.ADMIN, Role.PRACTITIONER, Role.PATIENT)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('bearerAuth')
  @Get(':id')
  @ApiOperation({ summary: 'Obtener un diagnóstico por id' })
  @ApiParam({ name: 'id', description: 'UUID del diagnóstico', type: String })
  @ApiResponse({ status: 200, description: 'Diagnóstico encontrado', type: SerializerDiagnosticDto })
  async findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string): Promise<SerializerDiagnosticDto> {
    const diagnostic = await this.diagnosticService.findOne(id);
    return toDto(SerializerDiagnosticDto, diagnostic);
  }

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('bearerAuth')
  @Post()
  @ApiOperation({ summary: 'Crear un nuevo diagnóstico' })
  @ApiResponse({ status: 201, description: 'Diagnóstico creado', type: SerializerDiagnosticDto })
  async create(@Body() createDiagnosticDto: CreateDiagnosticDto): Promise<SerializerDiagnosticDto> {
    const diagnostic = await this.diagnosticService.create(createDiagnosticDto);
    return toDto(SerializerDiagnosticDto, diagnostic);
  }

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('bearerAuth')
  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un diagnóstico existente' })
  @ApiParam({ name: 'id', description: 'UUID del diagnóstico', type: String })
  @ApiResponse({ status: 200, description: 'Diagnóstico actualizado', type: SerializerDiagnosticDto })
  async update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updateDiagnosticDto: UpdateDiagnosticDto
  ): Promise<SerializerDiagnosticDto> {
    const diagnostic = await this.diagnosticService.update(id, updateDiagnosticDto);
    return toDto(SerializerDiagnosticDto, diagnostic);
  }

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('bearerAuth')
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un diagnóstico de forma permanente' })
  @ApiParam({ name: 'id', description: 'UUID del diagnóstico', type: String })
  @ApiResponse({ status: 200, description: 'Diagnóstico eliminado' })
  async remove(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string): Promise<{ message: string }> {
    const message = await this.diagnosticService.remove(id);
    return { message };
  }

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('bearerAuth')
  @Patch('soft-remove/:id')
  @ApiOperation({ summary: 'Soft delete de un diagnóstico' })
  @ApiParam({ name: 'id', description: 'UUID del diagnóstico', type: String })
  @ApiResponse({ status: 200, description: 'Diagnóstico soft deleted' })
  async softRemove(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string): Promise<{ message: string }> {
    const message = await this.diagnosticService.softRemove(id);
    return { message };
  }

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('bearerAuth')
  @Patch('restore/:id')
  @ApiOperation({ summary: 'Restaurar un diagnóstico soft deleted' })
  @ApiParam({ name: 'id', description: 'UUID del diagnóstico', type: String })
  @ApiResponse({ status: 200, description: 'Diagnóstico restaurado', type: SerializerDiagnosticDto })
  async restore(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string): Promise<SerializerDiagnosticDto> {
    const diagnostic = await this.diagnosticService.restore(id);
    return toDto(SerializerDiagnosticDto, diagnostic);
  }

  @Roles(Role.ADMIN, Role.PRACTITIONER, Role.PATIENT)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('bearerAuth')
  @Get('filtered')
  @ApiOperation({ summary: 'Obtener diagnósticos filtrados por nombre y paginados' })
  @ApiQuery({ name: 'name', type: String, required: false, description: 'Nombre del diagnóstico' })
  @ApiQuery({ name: 'page', type: Number, required: false, example: 1, description: 'Número de página' })
  @ApiQuery({ name: 'limit', type: Number, required: false, example: 10, description: 'Límite de resultados por página' })
  @ApiResponse({ status: 200, description: 'Diagnósticos filtrados obtenidos', type: SerializerDiagnosticDto, isArray: true })
  async findFilteredByName(
    @Query() query: any
  ): Promise<{ data: SerializerDiagnosticDto[]; meta: any; msg: string }> {
    const { name, page = 1, limit = 10 } = query;
    const paginationDto: PaginationDto = { page: Number(page), limit: Number(limit) };
    const { data, meta, msg } = await this.diagnosticService.findFilteredByName(name, paginationDto);
    return { data: data.map(d => toDto(SerializerDiagnosticDto, d)), meta, msg };
  }
}
