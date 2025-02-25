import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationPreferencesServiceFactory } from 'src/common/bases/INotificationPreference-base.service';
import { CreateNotificationPreferenceDto, UpdateAdminNotificationPreferenceDto } from 'src/domain/dtos';
import { AdminNotificationPreference } from 'src/domain/entities';

import { Repository } from 'typeorm';

@Injectable()
export class AdminNotificationPreferenceService extends NotificationPreferencesServiceFactory<
  AdminNotificationPreference,
  CreateNotificationPreferenceDto,
  UpdateAdminNotificationPreferenceDto
>(AdminNotificationPreference) {
  constructor(
    @InjectRepository(AdminNotificationPreference)
    protected readonly repository: Repository<AdminNotificationPreference>
  ) {
    super(repository);
  }
}
