import { Module } from '@nestjs/common';
import { SpecialistsService } from './specialists.service';
import { SpecialistsController } from './specialists.controller';
import { Degree, Specialist, Speciality } from '../../domain/entities';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Specialist, Speciality, Degree])],
  controllers: [SpecialistsController],
  providers: [SpecialistsService],
  exports: [SpecialistsService]
})
export class SpecialistsModule {}
