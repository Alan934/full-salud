import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationPreferencesServiceFactory } from 'src/common/bases/notification-preferences-base.service';
import {
  CreateNotificationPreferencesDto,
  UpdateAdminsNotificationPreferencesDto
} from 'src/domain/dtos';
import { AdminsNotificationPreferences } from 'src/domain/entities';
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
