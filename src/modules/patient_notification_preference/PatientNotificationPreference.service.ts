import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationPreferencesServiceFactory } from 'src/common/bases/INotificationPreference-base.service';
import { CreateNotificationPreferenceDto, UpdatePatientNotificationPreferenceDto } from 'src/domain/dtos';
import { PatientNotificationPreference } from 'src/domain/entities';

import { Repository } from 'typeorm';

@Injectable()
export class PatientNotificationPreferenceService extends NotificationPreferencesServiceFactory<
    PatientNotificationPreference,
    CreateNotificationPreferenceDto,
    UpdatePatientNotificationPreferenceDto
>(PatientNotificationPreference) {
    constructor(
        @InjectRepository(PatientNotificationPreference)
        protected readonly repository: Repository<PatientNotificationPreference>
    ) {
        super(repository);
    }
}
