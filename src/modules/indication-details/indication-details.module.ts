import { Module } from '@nestjs/common';
import { IndicationDetailsService } from './indication-details.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IndicationDetail } from 'src/domain/entities';

@Module({
  imports: [TypeOrmModule.forFeature([IndicationDetail])],
  providers: [IndicationDetailsService]
})
export class IndicationDetailsModule {}
