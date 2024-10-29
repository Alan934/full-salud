import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InstitutionType } from 'src/domain/entities';
import { InstitutionTypesController } from './institution_types.controller';
import { InstitutionTypesService } from './institution_types.service';

@Module({
  imports: [TypeOrmModule.forFeature([InstitutionType])],
  controllers: [InstitutionTypesController],
  providers: [InstitutionTypesService],
  exports: [InstitutionTypesService]
})
export class InstitutionTypesModule {}
