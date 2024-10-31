import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  UpdateInstitutionsNotificationPreferencesDto,
  SerializerInstitutionsNotificationPreferencesDto,
  SerializerShortInstitutionsNotificationPreferencesDto
} from '../../domain/dtos';
import { InstitutionsNotificationPreferences } from '../../domain/entities';
import { NotificationPreferencesControllerFactory } from '../../common/factories/notification-preferences-base-controller.factory';
import { InstitutionsNotificationPreferencesService } from './institutions-notification-preferences.service';

@ApiTags("Institution's Notification Preferences")
@Controller('institutions-notification-preferences')
export class InstitutionsNotificationPreferencesController extends NotificationPreferencesControllerFactory<
  InstitutionsNotificationPreferences,
  UpdateInstitutionsNotificationPreferencesDto,
  SerializerInstitutionsNotificationPreferencesDto,
  SerializerShortInstitutionsNotificationPreferencesDto
>(
  UpdateInstitutionsNotificationPreferencesDto,
  SerializerInstitutionsNotificationPreferencesDto,
  SerializerShortInstitutionsNotificationPreferencesDto
) {
  constructor(
    protected readonly service: InstitutionsNotificationPreferencesService
  ) {
    super();
  }
}
