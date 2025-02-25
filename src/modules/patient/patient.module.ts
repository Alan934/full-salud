import {forwardRef, Module } from '@nestjs/common';
import { PatientService } from './patient.service';
import { PatientController } from './patient.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient, Practitioner, SocialWork } from '../../domain/entities';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Patient, Practitioner, SocialWork]),
  forwardRef(() => AuthModule) ],
  controllers: [PatientController],
  providers: [PatientService],
  exports: [PatientService]
})
export class PatientModule {}
