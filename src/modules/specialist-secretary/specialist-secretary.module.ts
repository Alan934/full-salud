import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpecialistSecretary } from '../../domain/entities';
import { SpecialistSecretariesService } from './specialist-secretary.service';
import { SpecialistSecretariesController } from './specialist-secretary.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SpecialistSecretary])],
  controllers: [SpecialistSecretariesController],
  providers: [SpecialistSecretariesService]
})
export class SpecialistSecretaryModule {}
