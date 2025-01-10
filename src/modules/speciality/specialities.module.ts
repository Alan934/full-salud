import { forwardRef, Module } from '@nestjs/common';
import { SpecialitiesService } from './specialities.service';
import { SpecialitiesController } from './specialities.controller';
import { Speciality } from '../../domain/entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Speciality]), forwardRef(() => AuthModule)],
  controllers: [SpecialitiesController],
  providers: [SpecialitiesService],
  exports: [SpecialitiesService]
})
export class SpecialitiesModule { }
