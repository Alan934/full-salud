// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// // import { NotificationPreferencesServiceFactory } from '../../common/bases/notification-preferences-base.service';
// import {
//   CreateNotificationPreferencesDto,
//   UpdateSpecialistsNotificationPreferencesDto
// } from '../../domain/dtos';
// import { SpecialistsNotificationPreferences } from '../../domain/entities';
// import { Repository } from 'typeorm';

// @Injectable()
// export class SpecialistsNotificationPreferencesService extends NotificationPreferencesServiceFactory<
//   SpecialistsNotificationPreferences,
//   CreateNotificationPreferencesDto,
//   UpdateSpecialistsNotificationPreferencesDto
// >(SpecialistsNotificationPreferences) {
//   constructor(
//     @InjectRepository(SpecialistsNotificationPreferences)
//     protected readonly repository: Repository<SpecialistsNotificationPreferences>
//   ) {
//     super(repository);
//   }
// }
