import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { LocationService } from './location.service';
import { ControllerFactory } from '../../common/factories/controller.factory';
import { Location } from '../../domain/entities';
import { CreateLocationDto, SerializerLocationDto, UpdatelocationDto } from '../../domain/dtos';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { toDto } from '../../common/util/transform-dto.util';
import { AuthGuard, Roles, RolesGuard } from '../auth/guards/auth.guard';
import { Role } from '../../domain/enums';

@ApiTags('Location')
@Controller('location')
export class LocationController extends ControllerFactory<
  Location,
  CreateLocationDto,
  UpdatelocationDto,
  SerializerLocationDto
>(Location, CreateLocationDto, UpdatelocationDto, SerializerLocationDto) {
  constructor(protected readonly locationsService: LocationService) {
    super();
  }

  @Roles(Role.PRACTITIONER, Role.ADMIN, Role.PATIENT)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('bearerAuth')
  @Post()
  async createlocation(@Body() createlocationDto: CreateLocationDto) {
    return await this.locationsService.createlocation(createlocationDto);
  }

  @Roles(Role.PRACTITIONER, Role.ADMIN, Role.PATIENT)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('bearerAuth')
  @Get()
  async getAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ): Promise<{ total: number; page: number; limit: number; locations: SerializerLocationDto[] }> {
    const { locations, total } = await this.locationsService.getAll(page, limit);
    return { locations: locations.map((location) => toDto(SerializerLocationDto, location)), total, page, limit };
  }

  @Roles(Role.PRACTITIONER, Role.ADMIN, Role.PATIENT)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('bearerAuth')
  @Get(':id')
  async getOnelocation(@Param('id') id: string) {
    return await this.locationsService.getOne(id);
  }

  @Roles(Role.PRACTITIONER, Role.ADMIN, Role.PATIENT)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('bearerAuth')
  @Patch(':id')
  async updatelocation(@Param('id') id: string, @Body() updatelocationDto: UpdatelocationDto) {
    return await this.locationsService.update(id, updatelocationDto);
  }

  @Roles(Role.PRACTITIONER, Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('bearerAuth')
  @Delete(':id')
  async softDelete(@Param('id') id: string) {
    return await this.locationsService.softDelete(id);
  }

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('bearerAuth')
  @Post('/recover/:id')
  async recover(@Param('id') id: string) {
    return await this.locationsService.recover(id);
  }
}
