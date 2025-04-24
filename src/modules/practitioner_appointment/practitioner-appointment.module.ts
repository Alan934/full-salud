import { forwardRef, Module } from '@nestjs/common';
import { PractitionerAppointmentService } from './practitioner-appointment.service';
import { PractitionerAppointmentController } from './practitioner-appointment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PractitionerAppointment } from '../../domain/entities';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([PractitionerAppointment]), forwardRef(() => AuthModule)],
  controllers: [PractitionerAppointmentController],
  providers: [PractitionerAppointmentService]
})
export class PractitionerAppointmentModule {}
