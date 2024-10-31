import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationPreferencesServiceFactory } from '../../common/bases/notification-preferences-base.service';
import {
  CreateNotificationPreferencesDto,
  UpdateAdminsNotificationPreferencesDto
} from '../../domain/dtos';
import { AdminsNotificationPreferences } from '../../domain/entities';
import { Repository } from 'typeorm';

@Injectable()
export class AdminsNotificationPreferencesService extends NotificationPreferencesServiceFactory<
  AdminsNotificationPreferences,
  CreateNotificationPreferencesDto,
  UpdateAdminsNotificationPreferencesDto
>(AdminsNotificationPreferences) {
  constructor(
    @InjectRepository(AdminsNotificationPreferences)
    protected readonly repository: Repository<AdminsNotificationPreferences>
  ) {
    super(repository);
  }
}
