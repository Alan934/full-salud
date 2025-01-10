import { Module } from '@nestjs/common';
import { SpecialistsService } from './specialists.service';
import { SpecialistsController } from './specialists.controller';
import { Specialist, Speciality } from '../../domain/entities';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { PersonsModule } from '../persons/persons.module';

@Module({
  imports: [TypeOrmModule.forFeature([Specialist, Speciality])/*, PersonsModule*/],
  controllers: [SpecialistsController],
  providers: [SpecialistsService],
  exports: [SpecialistsService]
})
export class SpecialistsModule {}
