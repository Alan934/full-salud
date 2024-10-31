import { Module } from '@nestjs/common';
import { SpecialistAttentionHourService } from './specialist-attention-hour.service';
import { SpecialistAttentionHourController } from './specialist-attention-hour.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpecialistAttentionHour } from '../../domain/entities';

@Module({
  imports: [TypeOrmModule.forFeature([SpecialistAttentionHour])],
  controllers: [SpecialistAttentionHourController],
  providers: [SpecialistAttentionHourService]
})
export class SpecialistAttentionHourModule {}
