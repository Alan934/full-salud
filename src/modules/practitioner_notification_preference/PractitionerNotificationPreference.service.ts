import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// import { NotificationPreferencesServiceFactory } from '../../common/bases/notification-preferences-base.service';
import {
    CreateNotificationPreferenceDto,
  UpdatePractitionerNotificationPreferenceDto
} from '../../domain/dtos';
import { PractitionerNotificationPreference } from '../../domain/entities';
import { Repository } from 'typeorm';
import { NotificationPreferencesServiceFactory } from '../../common/bases/INotificationPreference-base.service';

@Injectable()
export class PractitionerNotificationPreferenceService extends NotificationPreferencesServiceFactory<
  PractitionerNotificationPreference,
  CreateNotificationPreferenceDto,
  UpdatePractitionerNotificationPreferenceDto
>(PractitionerNotificationPreference) {
  constructor(
    @InjectRepository(PractitionerNotificationPreference)
    protected readonly repository: Repository<PractitionerNotificationPreference>
  ) {
    super(repository);
  }
}
