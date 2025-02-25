import { Module } from '@nestjs/common';
import { BranchService } from './Branch.service';
import { BranchController } from './Branch.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Branch } from '../../domain/entities';
// import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Branch])],
  providers: [BranchService],
  controllers: [BranchController],
  exports: [BranchService]
})
export class BranchModule {}
