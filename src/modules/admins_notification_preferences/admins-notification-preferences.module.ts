import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { AdminsNotificationPreferences } from 'src/domain/entities';
import { AdminsNotificationPreferencesController } from './admins-notification-preferences.controller';
import { AdminsNotificationPreferencesService } from './admins-notification-preferences.service';

@Module({
  imports: [TypeOrmModule.forFeature([AdminsNotificationPreferences])],
  controllers: [AdminsNotificationPreferencesController],
  providers: [AdminsNotificationPreferencesService],
  exports: [AdminsNotificationPreferencesService]
})
export class AdminsNotificationPreferencesModule {}
