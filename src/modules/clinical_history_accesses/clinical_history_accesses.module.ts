import { Module } from '@nestjs/common';
import { ClinicalHistoryAccessesController } from './clinical_history_accesses.controller';
import { ClinicalHistoryAccessesService } from './clinical_history_accesses.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClinicalHistoryAccess } from 'src/domain/entities';

@Module({
  imports: [TypeOrmModule.forFeature([ClinicalHistoryAccess])],
  controllers: [ClinicalHistoryAccessesController],
  providers: [ClinicalHistoryAccessesService]
})
export class ClinicalHistoryAccessesModule {}
