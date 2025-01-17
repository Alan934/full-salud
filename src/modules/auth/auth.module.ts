import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient, Specialist, User } from '../../domain/entities';
import { AuthController } from './auth.controller';
// import { PatientsNotificationPreferencesModule } from '../patients_notification_preferences/patients-notification-preferences.module';
// import { SpecialistsNotificationPreferencesModule } from '../specialists_notification_preferences/specialists-notification-preferences.module';
// import { InstitutionsNotificationPreferencesModule } from '../institutions_notification_preferences/institutions-notification-preferences.module';
// import { AdminsNotificationPreferencesModule } from '../admins_notification_preferences/admins-notification-preferences.module';
// import { SecretaryNotificationPreferencesModule } from '../secretary_notification_preferences/secretary-notification-preferences.module';
// import { SpecialistsSecretaryNotificationPreferencesModule } from '../specialists_secretary_notification_preferences/specialists-secretary-notification-preferences.module';
import { ProfileImagesModule } from '../profile_images/profile_images.module';
import { PatientModule } from '../patients/patients.module';
import { SpecialistsModule } from '../specialists/specialists.module';
// import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Specialist, Patient]),
    // PatientsNotificationPreferencesModule,
    // SpecialistsNotificationPreferencesModule,
    // InstitutionsNotificationPreferencesModule,
    // AdminsNotificationPreferencesModule,
    // SecretaryNotificationPreferencesModule,
    // SpecialistsSecretaryNotificationPreferencesModule,
    ProfileImagesModule,
    // NotificationsModule
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService]
})
export class AuthModule {}
