import { TypeOrmModule } from '@nestjs/typeorm';
import { PractitionerNotificationPreference } from '../../domain/entities';
import { Module } from '@nestjs/common';
import { PractitionerNotificationPreferenceController } from './PractitionerNotificationPreference.controller';
import { PractitionerNotificationPreferenceService } from './PractitionerNotificationPreference.service';

@Module({
  imports: [TypeOrmModule.forFeature([PractitionerNotificationPreference])],
  controllers: [PractitionerNotificationPreferenceController],
  providers: [PractitionerNotificationPreferenceService],
  exports: [PractitionerNotificationPreferenceService]
})
export class PractitionerNotificationPreferenceModule {}
