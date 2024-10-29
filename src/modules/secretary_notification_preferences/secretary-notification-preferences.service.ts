import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationPreferencesServiceFactory } from 'src/common/bases/notification-preferences-base.service';
import {
  CreateNotificationPreferencesDto,
  UpdateSecretaryNotificationPreferencesDto
} from 'src/domain/dtos';
import { SecretaryNotificationPreferences } from 'src/domain/entities';
import { Repository } from 'typeorm';

@Injectable()
export class SecretaryNotificationPreferencesService extends NotificationPreferencesServiceFactory<
  SecretaryNotificationPreferences,
  CreateNotificationPreferencesDto,
  UpdateSecretaryNotificationPreferencesDto
>(SecretaryNotificationPreferences) {
  constructor(
    @InjectRepository(SecretaryNotificationPreferences)
    protected readonly repository: Repository<SecretaryNotificationPreferences>
  ) {
    super(repository);
  }
}
