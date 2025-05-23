import { Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Query, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { SerializerNotificationDto } from '../../domain/dtos';
import { ApiBearerAuth, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { toDto } from '../../common/util/transform-dto.util';
import { PaginatedNotificationDto } from '../../domain/dtos/notification/paginatedNotificationsDto';
import { AuthGuard, Roles, RolesGuard } from '../auth/guards/auth.guard';
import { Role } from '../../domain/enums';

@ApiTags('Notification')
@Controller('notification')
export class NotificationController 
  // extends ControllerFactory<
  //   Notification,
  //   CreateNotificationDto,
  //   UpdateNotificationDto,
  //   SerializerNotificationDto
  // >(
  //   Notification,
  //   CreateNotificationDto,
  //   UpdateNotificationDto,
  //   SerializerNotificationDto
  //)  
{
  constructor(private readonly service: NotificationService) {
    //super();
  }

  @Roles(Role.PRACTITIONER, Role.ADMIN, Role.PATIENT)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('bearerAuth')
  @Get("getByPatient")
  @ApiOperation({ description: 'Buscar notificaciones por id de paciente ' })
  @ApiParam({ name: 'id', description: 'UUID de la notificacion', type: String })
  @ApiResponse({ status: 200, description: 'Notificacion Encontradas', 
    type: SerializerNotificationDto })
  @ApiResponse({ status: 404, description: 'Notificacion no encontrada' })
  async getNotificationByPatient(
    @Query('patientId', new ParseUUIDPipe({ version: '4' })) patientId: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10'
  ): Promise<PaginatedNotificationDto>{
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const { notifications, total, previousPage } = await this.service.getNotificationByPatient(patientId, pageNumber, limitNumber);
      return {
        notifications: notifications.map((notification) => toDto(SerializerNotificationDto, notification)),        total,
        page: pageNumber,
        limit: limitNumber,
        previousPage,
      };
  }

  @Roles(Role.PRACTITIONER, Role.ADMIN, Role.PATIENT)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('bearerAuth')
  @Get("getByPractitioner")
  @ApiOperation({ description: 'Buscar notificaciones por id de paciente ' })
  @ApiParam({ name: 'id', description: 'UUID de la Notificacion', type: String })
  @ApiResponse({ status: 200, description: 'Notificaciones encontradas', 
    type: SerializerNotificationDto })
  @ApiResponse({ status: 404, description: 'Notificacion no encontrada' })
  async getNotificationByPractitioner(
    @Query('practitionerId', new ParseUUIDPipe({ version: '4' })) practitionerId: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10'
  ): Promise<PaginatedNotificationDto>{
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const { notifications, total, previousPage } = await this.service.getNotificationByPracttioner(practitionerId, pageNumber, limitNumber);
      return {
        notifications: notifications.map((notification) => toDto(SerializerNotificationDto, notification)),
        total,
        page: pageNumber,
        limit: limitNumber,
        previousPage,
      };
  }

  @Roles(Role.PRACTITIONER, Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('bearerAuth')
  @Delete('/soft-delete/:id')
  @ApiOperation({ description: 'Eliminar un registro lógicamente' })
  @ApiNotFoundResponse({
    description: 'Record not found'
  })
  @ApiOkResponse({
    description: 'Record soft deleted successfully'
  })
    softRemove(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
      return this.service.softRemove(id);
  }

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('bearerAuth')
  @Patch('restore/:id')
  @ApiOperation({
    description: 'Recuperar un registro lógicamente eliminado'
  })
  @ApiNotFoundResponse({
    description: 'Record not found or not deleted'
  })
  @ApiOkResponse({
    description: 'Record restored successfully',
    type: SerializerNotificationDto
  })
  async restore(@Param('id',new ParseUUIDPipe({ version: '4' })) id: string) {
    const data = await this.service.restore(id);

    return toDto(SerializerNotificationDto, data);
  }
}
