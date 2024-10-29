import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SpecialistsNotificationPreferences } from 'src/domain/entities';
import {
  UpdateSpecialistsNotificationPreferencesDto,
  SerializerShortSpecialistsNotificationPreferencesDto,
  SerializerSpecialistsNotificationPreferencesDto
} from 'src/domain/dtos';
import { SpecialistsNotificationPreferencesService } from './specialists-notification-preferences.service';
import { NotificationPreferencesControllerFactory } from 'src/common/factories/notification-preferences-base-controller.factory';

@ApiTags("Specialist's Notification Preferences")
@Controller('specialists-notification-preferences')
export class SpecialistsNotificationPreferencesController extends NotificationPreferencesControllerFactory<
  SpecialistsNotificationPreferences,
  UpdateSpecialistsNotificationPreferencesDto,
  SerializerSpecialistsNotificationPreferencesDto,
  SerializerShortSpecialistsNotificationPreferencesDto
>(
  UpdateSpecialistsNotificationPreferencesDto,
  SerializerSpecialistsNotificationPreferencesDto,
  SerializerShortSpecialistsNotificationPreferencesDto
) {
  constructor(
    protected readonly service: SpecialistsNotificationPreferencesService
  ) {
    super();
  }
}
