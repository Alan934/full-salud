import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
    CreateNotificationPreferenceDto,
  UpdateSecretaryNotificationPreferenceDto
} from '../../domain/dtos';
import { SecretaryNotificationPreference } from '../../domain/entities';
import { Repository } from 'typeorm';
import { NotificationPreferencesServiceFactory } from '../../common/bases/INotificationPreference-base.service';

@Injectable()
export class SecretaryNotificationPreferenceService extends NotificationPreferencesServiceFactory<
  SecretaryNotificationPreference,
  CreateNotificationPreferenceDto,
  UpdateSecretaryNotificationPreferenceDto
>(SecretaryNotificationPreference) {
  constructor(
    @InjectRepository(SecretaryNotificationPreference)
    protected readonly repository: Repository<SecretaryNotificationPreference>
  ) {
    super(repository);
  }
}
