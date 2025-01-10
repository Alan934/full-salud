import { Module } from '@nestjs/common';
import { TurnsService } from './turns.service';
import { TurnsController } from './turns.controller';
import { Patient, Turn } from '../../domain/entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DerivationImagesModule } from '..';

@Module({
  imports: [TypeOrmModule.forFeature([Turn, Patient]), DerivationImagesModule],
  controllers: [TurnsController],
  providers: [TurnsService],
  exports: [TurnsService]
})
export class TurnsModule {}
