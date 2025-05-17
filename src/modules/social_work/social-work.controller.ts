import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { SocialWorkService } from './social-work.service';
import { ControllerFactory } from '../../common/factories/controller.factory';
import { SocialWork } from '../../domain/entities';
import { CreateSocialWorkDto, SerializerSocialWorkDto, UpdateSocialWorkDto } from '../../domain/dtos';
import { ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { toDto } from '../../common/util/transform-dto.util';
import { AuthGuard, Roles, RolesGuard } from '../auth/guards/auth.guard';
import { Role } from '../../domain/enums'; 
@ApiTags('Social Work')
@Controller('social-work')
export class SocialWorkController {
  constructor(protected readonly socialWorkService: SocialWorkService) { }

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('bearerAuth')
  @Post()
  @ApiOperation({ description: 'Crear una Obra Social' })
  @ApiCreatedResponse({
    description: 'Obra Social creada exitosamente',
    type: SerializerSocialWorkDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async createSocialWork(@Body() createSocialWorkDto: CreateSocialWorkDto) {
    return await this.socialWorkService.createSocialWork(createSocialWorkDto);
  }

  @Roles(Role.PRACTITIONER,Role.ADMIN,Role.PATIENT)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('bearerAuth')
  @Get()
  async getAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ): Promise<{ total: number; page: number; limit: number; socialWorks: SerializerSocialWorkDto[] }> {
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const { socialWorks, total } = await this.socialWorkService.getAll(pageNumber, limitNumber);
    return {
      socialWorks: socialWorks.map((socialWork) => toDto(SerializerSocialWorkDto, socialWork)),
      total,
      page: pageNumber,
      limit: limitNumber,
    };
  }

  @Roles(Role.ADMIN, Role.PRACTITIONER, Role.PATIENT)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('bearerAuth')
  @Get(':id')
  async getOneSocialWork(@Param('id') id: string) {
    return await this.socialWorkService.getOne(id);
  }

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('bearerAuth')
  @Patch(':id')
  async updateSocialWork(
    @Param('id') id: string,
    @Body() updateSocialWorkDto: UpdateSocialWorkDto,
  ) {
    return await this.socialWorkService.update(id, updateSocialWorkDto);
  }

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('bearerAuth')
  @Delete(':id')
  async softDelete(@Param('id') id: string) {
    return await this.socialWorkService.softDelete(id);
  }

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('bearerAuth')
  @Post('/recover/:id')
  async recover(@Param('id') id: string) {
    return await this.socialWorkService.recover(id);
  }
}