// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { NotificationPreferencesServiceFactory } from '../../common/bases/notification-preferences-base.service';
// import {
//   CreateNotificationPreferencesDto,
//   UpdatePatientsNotificationsPreferencesDto
// } from '../../domain/dtos';
// import { PatientsNotificationPreferences } from '../../domain/entities';
// import { Repository } from 'typeorm';

// @Injectable()
// export class PatientsNotificationPreferencesService extends NotificationPreferencesServiceFactory<
//   PatientsNotificationPreferences,
//   CreateNotificationPreferencesDto,
//   UpdatePatientsNotificationsPreferencesDto
// >(PatientsNotificationPreferences) {
//   constructor(
//     @InjectRepository(PatientsNotificationPreferences)
//     protected readonly repository: Repository<PatientsNotificationPreferences>
//   ) {
//     super(repository);
//   }
// }
