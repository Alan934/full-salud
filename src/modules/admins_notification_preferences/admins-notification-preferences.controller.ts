import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AdminsNotificationPreferences } from 'src/domain/entities';
import {
  UpdateAdminsNotificationPreferencesDto,
  SerializerAdminsNotificationPreferencesDto,
  SerializerShortAdminsNotificationPreferencesDto
} from 'src/domain/dtos';
import { AdminsNotificationPreferencesService } from './admins-notification-preferences.service';
import { NotificationPreferencesControllerFactory } from 'src/common/factories/notification-preferences-base-controller.factory';

@ApiTags("Admin's Notification Preferences")
@Controller('admins-notification-preferences')
export class AdminsNotificationPreferencesController extends NotificationPreferencesControllerFactory<
  AdminsNotificationPreferences,
  UpdateAdminsNotificationPreferencesDto,
  SerializerAdminsNotificationPreferencesDto,
  SerializerShortAdminsNotificationPreferencesDto
>(
  UpdateAdminsNotificationPreferencesDto,
  SerializerAdminsNotificationPreferencesDto,
  SerializerShortAdminsNotificationPreferencesDto
) {
  constructor(
    protected readonly service: AdminsNotificationPreferencesService
  ) {
    super();
  }
}
