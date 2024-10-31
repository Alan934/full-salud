import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InstitutionApplication } from '../../domain/entities';
import { InstitutionApplicationsController } from './institution_applications.controller';
import { InstitutionApplicationsService } from './institution_applications.service';
import { UserApplicationsModule } from '../user_applications/user_applications.module';
import { AuthModule } from '../auth/auth.module';
import { InstitutionsModule } from '../institutions/institutions.module';
import { HeadquartersModule } from '../headquarters/headquarters.module';
import { InstitutionTypesModule } from '../institution_types/institution_types.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([InstitutionApplication]),
    UserApplicationsModule,
    AuthModule,
    InstitutionsModule,
    InstitutionTypesModule,
    HeadquartersModule
  ],
  controllers: [InstitutionApplicationsController],
  providers: [InstitutionApplicationsService]
})
export class InstitutionApplicationsModule {}
