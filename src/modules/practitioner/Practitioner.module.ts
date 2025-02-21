import { forwardRef, Module } from '@nestjs/common';
import { PractitionerService } from './Practitioner.service';
import { PractitionerController } from './Practitioner.controller';
import { Degree, Office, Patient, Practitioner, PractitionerRole } from '../../domain/entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Practitioner, PractitionerRole, Degree, Patient, Office]) ,
  forwardRef(() => AuthModule)],
  controllers: [PractitionerController],
  providers: [PractitionerService],
  exports: [PractitionerService]
})
export class PractitionerModule {}
