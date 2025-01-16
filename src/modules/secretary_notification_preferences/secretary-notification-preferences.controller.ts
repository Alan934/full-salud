// import { Controller } from '@nestjs/common';
// import { ApiTags } from '@nestjs/swagger';
// import { SecretaryNotificationPreferences } from '../../domain/entities';
// import {
//   UpdateSecretaryNotificationPreferencesDto,
//   SerializerSecretaryNotificationPreferencesDto,
//   SerializerShortSecretaryNotificationPreferencesDto
// } from '../../domain/dtos';
// import { NotificationPreferencesControllerFactory } from '../../common/factories/notification-preferences-base-controller.factory';
// import { SecretaryNotificationPreferencesService } from './secretary-notification-preferences.service';

// @ApiTags("Secretary's Notification Preferences")
// @Controller('secretary-notification-preferences')
// export class SecretaryNotificationPreferencesController extends NotificationPreferencesControllerFactory<
//   SecretaryNotificationPreferences,
//   UpdateSecretaryNotificationPreferencesDto,
//   SerializerSecretaryNotificationPreferencesDto,
//   SerializerShortSecretaryNotificationPreferencesDto
// >(
//   UpdateSecretaryNotificationPreferencesDto,
//   SerializerSecretaryNotificationPreferencesDto,
//   SerializerShortSecretaryNotificationPreferencesDto
// ) {
//   constructor(
//     protected readonly service: SecretaryNotificationPreferencesService
//   ) {
//     super();
//   }
// }
