import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  UpdateOrganizationNotificationPreferenceDto,
  SerializerOrganizationNotificationPreferenceDto,
  SerializerShortOrganizationNotificationPreferenceDto
} from '../../domain/dtos';
import { OrganizationNotificationPreference } from '../../domain/entities';
import { OrganizationNotificationPreferenceService } from './OrganizationNotificationPreference.service';
import { NotificationPreferencesControllerFactory } from '../../common/factories/NotificationPreference-base-controller.factory';

@ApiTags("Organization Notification Preference")
@Controller('organization-notification-preference')
export class OrganizationNotificationPreferenceController extends NotificationPreferencesControllerFactory<
  OrganizationNotificationPreference,
  UpdateOrganizationNotificationPreferenceDto,
  SerializerOrganizationNotificationPreferenceDto,
  SerializerShortOrganizationNotificationPreferenceDto
>(
  UpdateOrganizationNotificationPreferenceDto,
  SerializerOrganizationNotificationPreferenceDto,
  SerializerShortOrganizationNotificationPreferenceDto
) {
  constructor(
    protected readonly service: OrganizationNotificationPreferenceService
  ) {
    super();
  }
}
