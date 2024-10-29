import { Module } from '@nestjs/common';
import { PatientTurnsService } from './patient_turns.service';
import { PatientTurnsController } from './patient_turns.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientTurn } from 'src/domain/entities';
import { PersonsModule } from '../persons/persons.module';
import { DisabilityCardsModule } from '../disability_cards/disability_cards.module';
import { TurnsModule } from '../turns/turns.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PatientTurn]),
    PersonsModule,
    DisabilityCardsModule,
    TurnsModule
  ],
  controllers: [PatientTurnsController],
  providers: [PatientTurnsService]
})
export class PatientTurnsModule {}
