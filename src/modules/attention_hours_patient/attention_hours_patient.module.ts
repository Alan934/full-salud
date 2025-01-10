import { Module } from '@nestjs/common';
import { AttentionHourPatient } from '../../domain/entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttentionHoursPatientController } from './attention_hours_patient.controller';
import { AttentionHoursPatientService } from './attention_hours_patient.service';

@Module({
  imports: [TypeOrmModule.forFeature([AttentionHourPatient])],
  controllers: [AttentionHoursPatientController],
  providers: [AttentionHoursPatientService]
})
export class AttentionHoursPatientModule {}
