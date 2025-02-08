import {forwardRef, Module } from '@nestjs/common';
import { PatientService } from './patients.service';
import { PatientController } from './patients.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient, Practitioner } from '../../domain/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Patient, Practitioner])],
  controllers: [PatientController],
  providers: [PatientService],
  exports: [PatientService]
})
export class PatientModule {}
