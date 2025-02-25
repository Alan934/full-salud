import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// import { NotificationPreferencesServiceFactory } from '../../common/bases/notification-preferences-base.service';
import {
  CreateNotificationPreferenceDto,
  UpdatePractitionerSecretaryNotificationPreferencesDto
} from '../../domain/dtos';
import { PractitionerSecretaryNotificationPreferences } from '../../domain/entities';
import { Repository } from 'typeorm';
import { NotificationPreferencesServiceFactory } from '../../common/bases/INotificationPreference-base.service';

@Injectable()
export class PractitionerSecretaryNotificationPreferencesService extends NotificationPreferencesServiceFactory<
  PractitionerSecretaryNotificationPreferences,
  CreateNotificationPreferenceDto,
  UpdatePractitionerSecretaryNotificationPreferencesDto
>(PractitionerSecretaryNotificationPreferences) {
  constructor(
    @InjectRepository(PractitionerSecretaryNotificationPreferences)
    protected readonly repository: Repository<PractitionerSecretaryNotificationPreferences>
  ) {
    super(repository);
  }
}
