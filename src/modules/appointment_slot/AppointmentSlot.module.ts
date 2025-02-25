import { Module } from '@nestjs/common';
import { AppointmentSlotService } from './AppointmentSlot.service';
import { AppointmentSlotController } from './AppointmentSlot.controller';
import { AppointmentSlot  } from '../../domain/entities';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([AppointmentSlot ])],
  controllers: [AppointmentSlotController],
  providers: [AppointmentSlotService]
})
export class AppointmentSlotModule {}
