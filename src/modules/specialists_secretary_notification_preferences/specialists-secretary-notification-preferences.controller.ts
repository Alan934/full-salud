import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SpecialistsSecretaryNotificationPreferences } from '../../domain/entities';
import {
  UpdateSpecialistsSecretaryNotificationPreferencesDto,
  SerializerShortSpecialistsSecretaryNotificationPreferencesDto,
  SerializerSpecialistsSecretaryNotificationPreferencesDto
} from '../../domain/dtos';
import { NotificationPreferencesControllerFactory } from '../../common/factories/notification-preferences-base-controller.factory';
import { SpecialistsSecretaryNotificationPreferencesService } from './specialists-secretary-notification-preferences.service';

@ApiTags("Specialist's Secretary's Notification Preferences")
@Controller('specialists-secretary-notification-preferences')
export class SpecialistsSecretaryNotificationPreferencesController extends NotificationPreferencesControllerFactory<
  SpecialistsSecretaryNotificationPreferences,
  UpdateSpecialistsSecretaryNotificationPreferencesDto,
  SerializerSpecialistsSecretaryNotificationPreferencesDto,
  SerializerShortSpecialistsSecretaryNotificationPreferencesDto
>(
  UpdateSpecialistsSecretaryNotificationPreferencesDto,
  SerializerSpecialistsSecretaryNotificationPreferencesDto,
  SerializerShortSpecialistsSecretaryNotificationPreferencesDto
) {
  constructor(
    protected readonly service: SpecialistsSecretaryNotificationPreferencesService
  ) {
    super();
  }
}
