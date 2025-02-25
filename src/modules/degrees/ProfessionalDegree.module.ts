import { Module } from '@nestjs/common';
import { ProfessionalDegreeService } from './ProfessionalDegree.service';
import { ProfessionalDegreeController } from './ProfessionalDegree.controller';
import { ProfessionalDegree } from '../../domain/entities';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ProfessionalDegree])],
  controllers: [ProfessionalDegreeController],
  providers: [ProfessionalDegreeService],
  exports: [ProfessionalDegreeService]
})
export class ProfessionalDegreeModule {}
