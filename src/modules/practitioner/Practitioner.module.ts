import { Module } from '@nestjs/common';
import { PractitionerService } from './Practitioner.service';
import { PractitionerController } from './Practitioner.controller';
import { Degree, Patient, Practitioner, PractitionerRole } from '../../domain/entities';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Practitioner, PractitionerRole, Degree, Patient])],
  controllers: [PractitionerController],
  providers: [PractitionerService],
  exports: [PractitionerService]
})
export class PractitionerModule {}
