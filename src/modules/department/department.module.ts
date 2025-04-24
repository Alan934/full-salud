import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Department } from '../../domain/entities';
import { DepartmentController } from './department.controller';
import { DepartmentService } from './department.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Department]), forwardRef(() => AuthModule)],
  controllers: [DepartmentController],
  providers: [DepartmentService]
})
export class DepartmentModule {}
