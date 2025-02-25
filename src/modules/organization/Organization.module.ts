import { Module } from '@nestjs/common';
import { OrganizationService } from './Organization.service';
import { OrganizationController } from './Organization.controller';
import { Organization } from '../../domain/entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BranchModule } from '../branch/Branch.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Organization]),
    BranchModule
  ],
  controllers: [OrganizationController],
  providers: [OrganizationService],
  exports: [OrganizationService]
})
export class OrganizationModule {}
