import { Module } from '@nestjs/common';
import { PrescriptionService } from './Prescription.service';
import { PrescriptionController } from './Prescription.controller';
import { Prescription } from '../../domain/entities';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Prescription])],
  controllers: [PrescriptionController],
  providers: [PrescriptionService]
})
export class PrescriptionModule {}
