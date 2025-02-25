import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { NotificationPreferencesControllerFactory } from '../../common/factories/NotificationPreference-base-controller.factory';
import { SerializerPatientNotificationPreferenceDto, SerializerShortPatientNotificationPreferenceDto, UpdatePatientNotificationPreferenceDto } from '../../domain/dtos';
import { PatientNotificationPreference } from '../../domain/entities';
import { PatientNotificationPreferenceService } from './PatientNotificationPreference.service';


@ApiTags("Patient's Notification Preferences")
@Controller('patients-notification-preferences')
export class PatientNotificationPreferenceController extends NotificationPreferencesControllerFactory<
  PatientNotificationPreference,
  UpdatePatientNotificationPreferenceDto,
  SerializerPatientNotificationPreferenceDto,
  SerializerShortPatientNotificationPreferenceDto
>(
    UpdatePatientNotificationPreferenceDto,
    SerializerPatientNotificationPreferenceDto,
    SerializerShortPatientNotificationPreferenceDto
) {
  constructor(
    protected readonly service: PatientNotificationPreferenceService
  ) {
    super();
  }
}
