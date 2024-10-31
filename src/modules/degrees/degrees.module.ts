import { Module } from '@nestjs/common';
import { DegreesService } from './degrees.service';
import { DegreesController } from './degrees.controller';
import { Degree } from '../../domain/entities';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Degree])],
  controllers: [DegreesController],
  providers: [DegreesService],
  exports: [DegreesService]
})
export class DegreesModule {}
