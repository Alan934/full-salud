import { forwardRef, Module } from '@nestjs/common';
import { PractitionerService } from './practitioner.service';
import { PractitionerController } from './practitioner.controller';
import {
  ProfessionalDegree,
  Location,
  Patient,
  Practitioner,
  PractitionerRole,
  User
} from '../../domain/entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { HttpModule } from '@nestjs/axios';
import { PractitionerSocialWork } from '../../domain/entities/practitioner-social-work.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Practitioner,
      PractitionerSocialWork,
      PractitionerRole,
      ProfessionalDegree,
      Patient,
      Location,
      User
    ]),
    HttpModule,
    forwardRef(() => AuthModule)
  ],
  controllers: [PractitionerController],
  providers: [PractitionerService],
  exports: [PractitionerService, TypeOrmModule]
})
export class PractitionerModule {}
