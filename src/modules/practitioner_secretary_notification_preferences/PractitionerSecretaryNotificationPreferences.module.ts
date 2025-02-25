import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { PractitionerSecretaryNotificationPreferences } from '../../domain/entities';
import { PractitionerSecretaryNotificationPreferencesController } from './PractitionerSecretaryNotificationPreferences.controller';
import { PractitionerSecretaryNotificationPreferencesService } from './PractitionerSecretaryNotificationPreferences.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PractitionerSecretaryNotificationPreferences])
  ],
  controllers: [PractitionerSecretaryNotificationPreferencesController],
  providers: [PractitionerSecretaryNotificationPreferencesService],
  exports: [PractitionerSecretaryNotificationPreferencesService]
})
export class PractitionerSecretaryNotificationPreferencesModule {}
