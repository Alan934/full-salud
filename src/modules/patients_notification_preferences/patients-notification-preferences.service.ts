import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationPreferencesServiceFactory } from 'src/common/bases/notification-preferences-base.service';
import {
  CreateNotificationPreferencesDto,
  UpdatePatientsNotificationsPreferencesDto
} from 'src/domain/dtos';
import { PatientsNotificationPreferences } from 'src/domain/entities';
import { Repository } from 'typeorm';

@Injectable()
export class PatientsNotificationPreferencesService extends NotificationPreferencesServiceFactory<
  PatientsNotificationPreferences,
  CreateNotificationPreferencesDto,
  UpdatePatientsNotificationsPreferencesDto
>(PatientsNotificationPreferences) {
  constructor(
    @InjectRepository(PatientsNotificationPreferences)
    protected readonly repository: Repository<PatientsNotificationPreferences>
  ) {
    super(repository);
  }
}
