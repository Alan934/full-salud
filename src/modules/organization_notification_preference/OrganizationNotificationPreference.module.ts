import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationNotificationPreference } from '../../domain/entities';
import { OrganizationNotificationPreferenceController } from './OrganizationNotificationPreference.controller';
import { OrganizationNotificationPreferenceService } from './OrganizationNotificationPreference.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [TypeOrmModule.forFeature([OrganizationNotificationPreference])],
  controllers: [OrganizationNotificationPreferenceController],
  providers: [OrganizationNotificationPreferenceService],
  exports: [OrganizationNotificationPreferenceService]
})
export class OrganizationNotificationPreferenceModule {}
