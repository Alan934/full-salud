import { forwardRef, Module } from '@nestjs/common';
import { AppointmentSlotService } from './appointment-slot.service';
import { AppointmentSlotController } from './appointment-slot.controller';
import { AppointmentSlot  } from '../../domain/entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([AppointmentSlot ]), forwardRef(() => AuthModule)],
  controllers: [AppointmentSlotController],
  providers: [AppointmentSlotService]
})
export class AppointmentSlotModule {}
