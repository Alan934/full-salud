import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post } from '@nestjs/common';
import { SpecialitiesService } from './specialities.service';
import { Speciality } from '../../domain/entities';
import { ControllerFactory } from '../../common/factories/controller.factory';
import {
  CreateSpecialityDto,
  SerializerSpecialityDto,
  UpdateSpecialityDto
} from '../../domain/dtos';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Specialities')
@Controller('specialities')
export class SpecialitiesController extends ControllerFactory<
  Speciality,
  CreateSpecialityDto,
  UpdateSpecialityDto,
  SerializerSpecialityDto
>(
  Speciality,
  CreateSpecialityDto,
  UpdateSpecialityDto,
  SerializerSpecialityDto
) {
  constructor(protected service: SpecialitiesService, private readonly specialitiesService: SpecialitiesService) {
    super();
  }

  @Post()
  @ApiOperation({ summary: 'Create a new speciality' })
  @ApiResponse({ status: 201, description: 'Speciality created successfully' })
  async create(@Body() createSpecialityDto: CreateSpecialityDto): Promise<Speciality> {
    return await this.specialitiesService.createSpeciality(createSpecialityDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a speciality by ID' })
  @ApiResponse({ status: 200, description: 'Speciality found' })
  @ApiResponse({ status: 404, description: 'Speciality not found' })
  async getOne(@Param('id') id: string): Promise<Speciality> {
    return await this.specialitiesService.getOne(id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all specialities' })
  @ApiResponse({ status: 200, description: 'List of specialities' })
  async getAll(): Promise<Speciality[]> {
    return await this.specialitiesService.getAll();
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a speciality by ID' })
  @ApiResponse({ status: 200, description: 'Speciality updated successfully' })
  @ApiResponse({ status: 404, description: 'Speciality not found' })
  async update(
    @Param('id') id: string, 
    @Body() updateSpecialityDto: UpdateSpecialityDto
  ): Promise<Speciality> {
    return await this.specialitiesService.updateSpeciality(id, updateSpecialityDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Soft delete a speciality by ID' })
  @ApiResponse({ status: 204, description: 'Speciality deleted successfully' })
  @ApiResponse({ status: 404, description: 'Speciality not found' })
  async removeSpeciality(@Param('id') id: string): Promise<void> {
    await this.specialitiesService.softDelete(id);
  }

  @Patch('/recover/:id')
  @ApiOperation({ summary: 'Recover a soft-deleted speciality by ID' })
  @ApiResponse({ status: 200, description: 'Speciality recovered successfully' })
  @ApiResponse({ status: 404, description: 'Speciality not found or not deleted' })
  async recover(@Param('id') id: string): Promise<Speciality> {
    return await this.specialitiesService.recoverSpeciality(id);
  }

}
