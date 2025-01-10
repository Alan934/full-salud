import {forwardRef, Module } from '@nestjs/common';
import { PatientService } from './patients.service';
import { PatientController } from './patients.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from '../../domain/entities';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Patient]), forwardRef(() => AuthModule)],
  controllers: [PatientController],
  providers: [PatientService],
  exports: [PatientService]
})
export class PatientModule {}
