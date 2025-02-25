import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Location } from '../../domain/entities';
import { LocationController } from './Location.controller';
import { LocationService } from './Location.service';

@Module({
  imports: [TypeOrmModule.forFeature([Location])],
  controllers: [LocationController],
  providers: [LocationService]
})
export class LocationModule {}
