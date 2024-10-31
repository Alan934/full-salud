import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { SpecialistsSecretaryNotificationPreferences } from '../../domain/entities';
import { SpecialistsSecretaryNotificationPreferencesController } from './specialists-secretary-notification-preferences.controller';
import { SpecialistsSecretaryNotificationPreferencesService } from './specialists-secretary-notification-preferences.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([SpecialistsSecretaryNotificationPreferences])
  ],
  controllers: [SpecialistsSecretaryNotificationPreferencesController],
  providers: [SpecialistsSecretaryNotificationPreferencesService],
  exports: [SpecialistsSecretaryNotificationPreferencesService]
})
export class SpecialistsSecretaryNotificationPreferencesModule {}
