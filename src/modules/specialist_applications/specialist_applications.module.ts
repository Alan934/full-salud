import { Module } from '@nestjs/common';
import { SpecialistApplicationsController } from './specialist_applications.controller';
import { SpecialistApplicationsService } from './specialist_applications.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpecialistApplication } from '../../domain/entities';
import { UserApplicationsModule } from '../user_applications/user_applications.module';
import { PractitionerModule } from '../practitioner/Practitioner.module';
import { PractitionerRoleModule } from '../practitioner-role/PractitionerRole.module';
import { DegreesModule } from '../degrees/degrees.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SpecialistApplication]),
    UserApplicationsModule,
    PractitionerModule,
    PractitionerRoleModule,
    DegreesModule
  ],
  controllers: [SpecialistApplicationsController],
  providers: [SpecialistApplicationsService]
})
export class SpecialistApplicationsModule {}
