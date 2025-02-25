import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PractitionerSecretaryNotificationPreferences } from '../../domain/entities';
import {
  UpdatePractitionerSecretaryNotificationPreferencesDto,
  SerializerShortPractitionerSecretaryNotificationPreferencesDto,
  SerializerPractitionerSecretaryNotificationPreferencesDto
} from '../../domain/dtos';
import { NotificationPreferencesControllerFactory } from '../../common/factories/NotificationPreference-base-controller.factory';
import { PractitionerSecretaryNotificationPreferencesService } from './PractitionerSecretaryNotificationPreferences.service';

@ApiTags("Practitioner Secretary Notification Preferences")
@Controller('practitioner-secretary-notification-preferences')
export class PractitionerSecretaryNotificationPreferencesController extends NotificationPreferencesControllerFactory<
  PractitionerSecretaryNotificationPreferences,
  UpdatePractitionerSecretaryNotificationPreferencesDto,
  SerializerPractitionerSecretaryNotificationPreferencesDto,
  SerializerShortPractitionerSecretaryNotificationPreferencesDto
>(
  UpdatePractitionerSecretaryNotificationPreferencesDto,
  SerializerPractitionerSecretaryNotificationPreferencesDto,
  SerializerShortPractitionerSecretaryNotificationPreferencesDto
) {
  constructor(
    protected readonly service: PractitionerSecretaryNotificationPreferencesService
  ) {
    super();
  }
}
