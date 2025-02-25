import { Module } from '@nestjs/common';
import { PractitionerAppointmentService } from './PractitionerAppointment.service';
import { PractitionerAppointmentController } from './PractitionerAppointment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PractitionerAppointment } from '../../domain/entities';

@Module({
  imports: [TypeOrmModule.forFeature([PractitionerAppointment])],
  controllers: [PractitionerAppointmentController],
  providers: [PractitionerAppointmentService]
})
export class PractitionerAppointmentModule {}
