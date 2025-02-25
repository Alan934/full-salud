import { Module } from '@nestjs/common';
import { PatientAppointment } from '../../domain/entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientAppointmentController } from './PatientAppointment.controller';
import { PatientAppointmentService } from './PatientAppointment.service';

@Module({
  imports: [TypeOrmModule.forFeature([PatientAppointment])],
  controllers: [PatientAppointmentController],
  providers: [PatientAppointmentService]
})
export class PatientAppointmentModule {}
