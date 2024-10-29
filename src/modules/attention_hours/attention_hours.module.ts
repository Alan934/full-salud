import { Module } from '@nestjs/common';
import { AttentionHoursService } from './attention_hours.service';
import { AttentionHoursController } from './attention_hours.controller';
import { AttentionHour } from 'src/domain/entities';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([AttentionHour])],
  controllers: [AttentionHoursController],
  providers: [AttentionHoursService]
})
export class AttentionHoursModule {}
