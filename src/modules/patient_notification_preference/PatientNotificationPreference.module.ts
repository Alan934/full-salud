import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { PatientNotificationPreference } from '../../domain/entities';
import { PatientNotificationPreferenceController } from './PatientNotificationPreference.controller';
import { PatientNotificationPreferenceService } from './PatientNotificationPreference.service';

@Module({
    imports: [TypeOrmModule.forFeature([PatientNotificationPreference])],
    controllers: [PatientNotificationPreferenceController],
    providers: [PatientNotificationPreferenceService],
    exports: [PatientNotificationPreferenceService]
})
export class PatientNotificationPreferenceModule { }
