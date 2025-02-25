import { Module } from '@nestjs/common';
import { AppointmentService } from './Appointment.service';
import { AppointmentController } from './Appointment.controller';
import { Patient, Appointment } from '../../domain/entities';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment, Patient])],
  controllers: [AppointmentController],
  providers: [AppointmentService],
  exports: [AppointmentService]
})
export class AppointmentModule {}
