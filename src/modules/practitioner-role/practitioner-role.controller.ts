import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { PractitionerRoleService } from './practitioner-role.service';
import { PractitionerRole } from '../../domain/entities';
import { ControllerFactory } from '../../common/factories/controller.factory';
import {
  CreatePractitionerRoleDto,
  SerializerPractitionerRoleDto,
  UpdatePractitionerRoleDto
} from '../../domain/dtos';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Role } from '../../domain/enums/role.enum';
import { AuthGuard, Roles, RolesGuard } from '../auth/guards/auth.guard';
@ApiTags('Practitioner Role')
@Controller('practitioner-role')
export class PractitionerRoleController {
  constructor(protected service: PractitionerRoleService, private readonly practitionerRoleService: PractitionerRoleService) {
  }

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('bearerAuth')
  @Post()
  @ApiOperation({ summary: 'Create a new practitionerRole' })
  @ApiResponse({ status: 201, description: 'practitionerRole created successfully' })
  async create(@Body() createpractitionerRoleDto: CreatePractitionerRoleDto): Promise<PractitionerRole> {
    return await this.practitionerRoleService.createpractitionerRole(createpractitionerRoleDto);
  }

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('bearerAuth')
  @Get(':id')
  @ApiOperation({ summary: 'Get a practitionerRole by ID' })
  @ApiResponse({ status: 200, description: 'practitionerRole found' })
  @ApiResponse({ status: 404, description: 'practitionerRole not found' })
  async getOne(@Param('id') id: string): Promise<PractitionerRole> {
    return await this.practitionerRoleService.getOne(id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all practitionerRole' })
  @ApiResponse({ status: 200, description: 'List of practitionerRole' })
  async getAll(): Promise<PractitionerRole[]> {
    return await this.practitionerRoleService.getAll();
  }

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('bearerAuth')
  @Patch(':id')
  @ApiOperation({ summary: 'Update a practitionerRole by ID' })
  @ApiResponse({ status: 200, description: 'practitionerRole updated successfully' })
  @ApiResponse({ status: 404, description: 'practitionerRole not found' })
  async update(
    @Param('id') id: string, 
    @Body() updatepractitionerRoleDto: UpdatePractitionerRoleDto
  ): Promise<PractitionerRole> {
    return await this.practitionerRoleService.updatepractitionerRole(id, updatepractitionerRoleDto);
  }

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('bearerAuth')
  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Soft delete a practitionerRole by ID' })
  @ApiResponse({ status: 204, description: 'practitionerRole deleted successfully' })
  @ApiResponse({ status: 404, description: 'practitionerRole not found' })
  async removepractitionerRole(@Param('id') id: string): Promise<void> {
    await this.practitionerRoleService.softDelete(id);
  }

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('bearerAuth')
  @Patch('/recover/:id')
  @ApiOperation({ summary: 'Recover a soft-deleted practitionerRole by ID' })
  @ApiResponse({ status: 200, description: 'practitionerRole recovered successfully' })
  @ApiResponse({ status: 404, description: 'practitionerRole not found or not deleted' })
  async recover(@Param('id') id: string): Promise<PractitionerRole> {
    return await this.practitionerRoleService.recoverpractitionerRole(id);
  }

}

