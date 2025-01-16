import { Module } from '@nestjs/common';
import { InstitutionsService } from './institutions.service';
import { InstitutionsController } from './institutions.controller';
import { Institution } from '../../domain/entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HeadquartersModule } from '../headquarters/headquarters.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Institution]),
    HeadquartersModule
  ],
  controllers: [InstitutionsController],
  providers: [InstitutionsService],
  exports: [InstitutionsService]
})
export class InstitutionsModule {}
