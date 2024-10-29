import { Module } from '@nestjs/common';
import { PatientsUsersConnectionsService } from './patients-users-connections.service';
import { PatientsUsersConnectionsController } from './patients-users-connections.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientUserConnection } from 'src/domain/entities';

@Module({
  imports: [TypeOrmModule.forFeature([PatientUserConnection])],
  controllers: [PatientsUsersConnectionsController],
  providers: [PatientsUsersConnectionsService]
})
export class PatientsUsersConnectionsModule {}
