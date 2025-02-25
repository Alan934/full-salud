import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationType } from '../../domain/entities';
import { OrganizationTypeController } from './OrganizationType.controller';
import { OrganizationTypeService } from './OrganizationType.service';

@Module({
  imports: [TypeOrmModule.forFeature([OrganizationType])],
  controllers: [OrganizationTypeController],
  providers: [OrganizationTypeService],
  exports: [OrganizationTypeService]
})
export class OrganizationTypeModule {}
