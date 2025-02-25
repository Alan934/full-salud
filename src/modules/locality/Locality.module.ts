import { Module } from '@nestjs/common';
import { LocalityService } from './Locality.service';
import { LocalityController } from './Locality.controller';
import { Locality } from '../../domain/entities';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Locality])],
  controllers: [LocalityController],
  providers: [LocalityService]
})
export class LocalityModule {}
