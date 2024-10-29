import { TypeOrmModule } from '@nestjs/typeorm';
import { SpecialistsNotificationPreferences } from 'src/domain/entities';
import { Module } from '@nestjs/common';
import { SpecialistsNotificationPreferencesController } from './specialists-notification-preferences.controller';
import { SpecialistsNotificationPreferencesService } from './specialists-notification-preferences.service';

@Module({
  imports: [TypeOrmModule.forFeature([SpecialistsNotificationPreferences])],
  controllers: [SpecialistsNotificationPreferencesController],
  providers: [SpecialistsNotificationPreferencesService],
  exports: [SpecialistsNotificationPreferencesService]
})
export class SpecialistsNotificationPreferencesModule {}
