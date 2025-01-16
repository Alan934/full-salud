// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { NotificationPreferencesServiceFactory } from '../../common/bases/notification-preferences-base.service';
// import {
//   CreateNotificationPreferencesDto,
//   UpdateSecretaryNotificationPreferencesDto
// } from '../../domain/dtos';
// import { SecretaryNotificationPreferences } from '../../domain/entities';
// import { Repository } from 'typeorm';

// @Injectable()
// export class SecretaryNotificationPreferencesService extends NotificationPreferencesServiceFactory<
//   SecretaryNotificationPreferences,
//   CreateNotificationPreferencesDto,
//   UpdateSecretaryNotificationPreferencesDto
// >(SecretaryNotificationPreferences) {
//   constructor(
//     @InjectRepository(SecretaryNotificationPreferences)
//     protected readonly repository: Repository<SecretaryNotificationPreferences>
//   ) {
//     super(repository);
//   }
// }
