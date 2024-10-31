import { Module } from '@nestjs/common';
import { DerivationsService } from './derivations.service';
import { DerivationsController } from './derivations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Derivation } from '../../domain/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Derivation])],
  providers: [DerivationsService],
  controllers: [DerivationsController]
})
export class DerivationsModule {}
