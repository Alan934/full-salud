import { Module } from '@nestjs/common';
import { PatientTurnsService } from './patient_turns.service';
import { PatientTurnsController } from './patient_turns.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientTurn } from '../../domain/entities';
import { DisabilityCardsModule } from '../disability_cards/disability_cards.module';
import { TurnsModule } from '../turns/turns.module';
import { PatientModule } from '../patients/patients.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PatientTurn]),
    PatientModule,
    DisabilityCardsModule,
    TurnsModule
  ],
  controllers: [PatientTurnsController],
  providers: [PatientTurnsService]
})
export class PatientTurnsModule {}
