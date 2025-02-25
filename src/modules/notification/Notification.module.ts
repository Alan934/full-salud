import { Module } from '@nestjs/common';
import { NotificationService } from './Notification.service';
import { NotificationController } from './Notification.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from '../../domain/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Notification])],
  controllers: [NotificationController],
  providers: [NotificationService],
  exports: [NotificationService]
})
export class NotificationModule {}
