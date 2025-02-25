import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RelatedPerson } from '../../domain/entities/RelatedPerson.entity';
import { RelatedPersonService } from './RelatedPerson.service';
import { RelatedPersonController } from './RelatedPerson.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RelatedPerson])],
  controllers: [RelatedPersonController],
  providers: [RelatedPersonService]
})
export class RelatedPersonModule {}
