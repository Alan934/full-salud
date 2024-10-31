import { Module } from '@nestjs/common';
import { IndicationsController } from './indications.controller';
import { IndicationsService } from './indications.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Indication } from '../../domain/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Indication])],
  controllers: [IndicationsController],
  providers: [IndicationsService]
})
export class IndicationsModule {}
