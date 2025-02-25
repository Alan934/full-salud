import { forwardRef, Module } from '@nestjs/common';
import { PatientPractitionerFavoriteService } from './PatientPractitionerFavorite.service';
import { PatientPractitionerFavoriteController } from './PatientPractitionerFavorite.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientPractitionerFavorite } from '../../domain/entities/PatientPractitionerFavorite.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports:[TypeOrmModule.forFeature([PatientPractitionerFavorite]), 
          forwardRef(()=>AuthModule),],
  controllers: [PatientPractitionerFavoriteController],
  providers: [PatientPractitionerFavoriteService],
  exports:[PatientPractitionerFavoriteService]
})
export class PatientPractitionerFavoriteModule {}
