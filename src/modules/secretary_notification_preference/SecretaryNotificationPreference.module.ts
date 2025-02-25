import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { SecretaryNotificationPreference } from '../../domain/entities';
import { SecretaryNotificationPreferenceController } from './SecretaryNotificationPreference.controller';
import { SecretaryNotificationPreferenceService } from './SecretaryNotificationPreference.service';

@Module({
  imports: [TypeOrmModule.forFeature([SecretaryNotificationPreference])],
  controllers: [SecretaryNotificationPreferenceController],
  providers: [SecretaryNotificationPreferenceService],
  exports: [SecretaryNotificationPreferenceService]
})
export class SecretaryNotificationPreferenceModule {}
