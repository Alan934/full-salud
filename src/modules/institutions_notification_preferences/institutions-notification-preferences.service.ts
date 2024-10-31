import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationPreferencesServiceFactory } from '../../common/bases/notification-preferences-base.service';
import {
  CreateNotificationPreferencesDto,
  UpdateInstitutionsNotificationPreferencesDto
} from '../../domain/dtos';
import { InstitutionsNotificationPreferences } from '../../domain/entities';
import { Repository } from 'typeorm';

@Injectable()
export class InstitutionsNotificationPreferencesService extends NotificationPreferencesServiceFactory<
  InstitutionsNotificationPreferences,
  CreateNotificationPreferencesDto,
  UpdateInstitutionsNotificationPreferencesDto
>(InstitutionsNotificationPreferences) {
  constructor(
    @InjectRepository(InstitutionsNotificationPreferences)
    protected readonly repository: Repository<InstitutionsNotificationPreferences>
  ) {
    super(repository);
  }
}
