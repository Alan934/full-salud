import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationPreferencesServiceFactory } from '../../common/bases/notification-preferences-base.service';
import {
  CreateNotificationPreferencesDto,
  UpdateSpecialistsSecretaryNotificationPreferencesDto
} from '../../domain/dtos';
import { SpecialistsSecretaryNotificationPreferences } from '../../domain/entities';
import { Repository } from 'typeorm';

@Injectable()
export class SpecialistsSecretaryNotificationPreferencesService extends NotificationPreferencesServiceFactory<
  SpecialistsSecretaryNotificationPreferences,
  CreateNotificationPreferencesDto,
  UpdateSpecialistsSecretaryNotificationPreferencesDto
>(SpecialistsSecretaryNotificationPreferences) {
  constructor(
    @InjectRepository(SpecialistsSecretaryNotificationPreferences)
    protected readonly repository: Repository<SpecialistsSecretaryNotificationPreferences>
  ) {
    super(repository);
  }
}
