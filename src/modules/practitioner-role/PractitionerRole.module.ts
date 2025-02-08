import { forwardRef, Module } from '@nestjs/common';
import { PractitionerRoleService } from './PractitionerRole.service';
import { PractitionerRoleController } from './PractitionerRole.controller';
import { PractitionerRole } from '../../domain/entities';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([PractitionerRole])],
  controllers: [PractitionerRoleController],
  providers: [PractitionerRoleService],
  exports: [PractitionerRoleService]
})
export class PractitionerRoleModule { }
