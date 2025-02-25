import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Department } from '../../domain/entities';
import { DepartmentController } from './Department.controller';
import { DepartmentService } from './Department.service';

@Module({
  imports: [TypeOrmModule.forFeature([Department])],
  controllers: [DepartmentController],
  providers: [DepartmentService]
})
export class DepartmentModule {}
