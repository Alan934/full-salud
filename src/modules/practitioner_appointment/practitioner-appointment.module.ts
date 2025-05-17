import { forwardRef, Module } from '@nestjs/common';
import { PractitionerAppointmentService } from './practitioner-appointment.service';
import { PractitionerAppointmentController } from './practitioner-appointment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Practitioner, PractitionerAppointment } from '../../domain/entities';
import { AuthModule } from '../auth/auth.module';
import { Location } from '../../domain/entities/location.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PractitionerAppointment, Location, Practitioner]), forwardRef(() => AuthModule)],
  controllers: [PractitionerAppointmentController],
  providers: [PractitionerAppointmentService]
})
export class PractitionerAppointmentModule {}
