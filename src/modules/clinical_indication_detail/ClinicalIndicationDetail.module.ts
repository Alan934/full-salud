import { Module } from '@nestjs/common';
import { ClinicalIndicationDetailService } from './ClinicalIndicationDetail.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClinicalIndicationDetail } from '../../domain/entities';

@Module({
  imports: [TypeOrmModule.forFeature([ClinicalIndicationDetail])],
  providers: [ClinicalIndicationDetailService]
})
export class ClinicalIndicationDetailModule {}
