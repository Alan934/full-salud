import { forwardRef, Module } from '@nestjs/common';
import { PatientAppointment } from '../../domain/entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientAppointmentController } from './patient-appointment.controller';
import { PatientAppointmentService } from './patient-appointment.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([PatientAppointment]), forwardRef(() => AuthModule)],
  controllers: [PatientAppointmentController],
  providers: [PatientAppointmentService]
})
export class PatientAppointmentModule {}
