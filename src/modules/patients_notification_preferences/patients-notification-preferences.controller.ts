import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PatientsNotificationPreferences } from 'src/domain/entities';
import {
  UpdatePatientsNotificationsPreferencesDto,
  SerializerPatientsNotificationPreferencesDto,
  SerializerShortPatientsNotificationPreferencesDto
} from 'src/domain/dtos';
import { PatientsNotificationPreferencesService } from './patients-notification-preferences.service';
import { NotificationPreferencesControllerFactory } from 'src/common/factories/notification-preferences-base-controller.factory';

@ApiTags("Patient's Notification Preferences")
@Controller('patients-notification-preferences')
export class PatientsNotificationPreferencesController extends NotificationPreferencesControllerFactory<
  PatientsNotificationPreferences,
  UpdatePatientsNotificationsPreferencesDto,
  SerializerPatientsNotificationPreferencesDto,
  SerializerShortPatientsNotificationPreferencesDto
>(
  UpdatePatientsNotificationsPreferencesDto,
  SerializerPatientsNotificationPreferencesDto,
  SerializerShortPatientsNotificationPreferencesDto
) {
  constructor(
    protected readonly service: PatientsNotificationPreferencesService
  ) {
    super();
  }
}
