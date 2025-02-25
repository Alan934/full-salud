import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PractitionerSecretary } from '../../domain/entities';
import { PractitionerSecretaryService } from './PractitionerSecretary.service';
import { PractitionerSecretaryController } from './PractitionerSecretary.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PractitionerSecretary])],
  controllers: [PractitionerSecretaryController],
  providers: [PractitionerSecretaryService]
})
export class PractitionerSecretaryModule {}
