import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Relationship } from 'src/domain/entities/relationship.entity';
import { RelationshipService } from './relationship.service';
import { RelationshipController } from './relationship.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Relationship])],
  controllers: [RelationshipController],
  providers: [RelationshipService]
})
export class RelationshipModule {}
