import { forwardRef, Module } from '@nestjs/common';
import { ClinicalIndicationController } from './clinical-indication.controller';
import { ClinicalIndicationService } from './clinical-indication.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClinicalIndication } from '../../domain/entities';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([ClinicalIndication]), forwardRef(() => AuthModule)],
  controllers: [ClinicalIndicationController],
  providers: [ClinicalIndicationService]
})
export class ClinicalIndicationModule {}
