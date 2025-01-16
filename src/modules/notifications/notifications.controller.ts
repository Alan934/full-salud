// import { Controller } from '@nestjs/common';
// import { NotificationsService } from './notifications.service';
// import { ControllerFactory } from '../../common/factories/controller.factory';
// import { Notification } from '../../domain/entities';
// import {
//   CreateNotificationDto,
//   SerializerNotificationDto,
//   UpdateNotificatioDto
// } from '../../domain/dtos';
// import { ApiTags } from '@nestjs/swagger';

// @ApiTags('Notifications')
// @Controller('notifications')
// export class NotificationsController extends ControllerFactory<
//   Notification,
//   CreateNotificationDto,
//   UpdateNotificatioDto,
//   SerializerNotificationDto
// >(
//   Notification,
//   CreateNotificationDto,
//   UpdateNotificatioDto,
//   SerializerNotificationDto
// ) {
//   constructor(private readonly service: NotificationsService) {
//     super();
//   }
// }
