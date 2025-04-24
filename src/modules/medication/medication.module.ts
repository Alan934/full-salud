import { forwardRef, Module } from '@nestjs/common';
import { MedicationService } from './medication.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Medication } from '../../domain/entities';
import { MedicationController } from './medication.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Medication]), forwardRef(() => AuthModule)],
  controllers: [MedicationController],
  providers: [MedicationService]
})
export class MedicationModule {}
