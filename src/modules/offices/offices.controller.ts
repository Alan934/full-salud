import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { OfficesService } from './offices.service';
import { ControllerFactory } from '../../common/factories/controller.factory';
import { Office } from '../../domain/entities';
import { CreateOfficeDto, SerializerOfficeDto, UpdateOfficeDto } from '../../domain/dtos';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard, Roles, RolesGuard } from '../auth/guards/auth.guard';
import { Role } from '../../domain/enums/role.enum';
import { toDto } from '../../common/util/transform-dto.util';

@ApiTags('Offices')
@Controller('offices')
export class OfficesController extends ControllerFactory<
  Office,
  CreateOfficeDto,
  UpdateOfficeDto,
  SerializerOfficeDto
>(Office, CreateOfficeDto, UpdateOfficeDto, SerializerOfficeDto) {
  constructor(protected readonly officesService: OfficesService) {
    super();
  }

  @Post()
  async createOffice(@Body() createOfficeDto: CreateOfficeDto) {
    return await this.officesService.createOffice(createOfficeDto);
  }

  @Get()
  async getAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ): Promise<{ total: number; page: number; limit: number; offices: SerializerOfficeDto[] }> {
    const { offices, total } = await this.officesService.getAll(page, limit);
    return { offices: offices.map((office) => toDto(SerializerOfficeDto, office)), total, page, limit };
  }

  @Get(':id')
  async getOneOffice(@Param('id') id: string) {
    return await this.officesService.getOne(id);
  }

  @Patch(':id')
  async updateOffice(@Param('id') id: string, @Body() updateOfficeDto: UpdateOfficeDto) {
    return await this.officesService.update(id, updateOfficeDto);
  }

  @Delete(':id')
  async softDelete(@Param('id') id: string) {
    return await this.officesService.softDelete(id);
  }

  @Post('/recover/:id')
  async recover(@Param('id') id: string) {
    return await this.officesService.recover(id);
  }
}
