import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicationRequest } from '../../domain/entities/MedicationRequest.entity';
import { MedicationRequestsController } from './MedicationRequest.controller';
import { AuthModule } from '../auth/auth.module';
import { PractitionerModule } from '../practitioner/Practitioner.module';
import { PatientModule } from '../patient/patient.module';
import { MedicationRequestsService } from './MedicationRequest.service';

@Module({
  imports: [TypeOrmModule.forFeature([MedicationRequest]),AuthModule,PractitionerModule,PatientModule],
  controllers: [MedicationRequestsController],
  providers: [MedicationRequestsService]
})
export class MedicationRequestsModule {}
