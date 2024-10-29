import { Module } from '@nestjs/common';
import { SpecialistApplicationsController } from './specialist_applications.controller';
import { SpecialistApplicationsService } from './specialist_applications.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpecialistApplication } from 'src/domain/entities';
import { UserApplicationsModule } from '../user_applications/user_applications.module';
import { AuthModule } from '../auth/auth.module';
import { SpecialistsModule } from '../specialists/specialists.module';
import { SpecialitiesModule } from '../specialities/specialities.module';
import { DegreesModule } from '../degrees/degrees.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SpecialistApplication]),
    UserApplicationsModule,
    AuthModule,
    SpecialistsModule,
    SpecialitiesModule,
    DegreesModule
  ],
  controllers: [SpecialistApplicationsController],
  providers: [SpecialistApplicationsService]
})
export class SpecialistApplicationsModule {}
