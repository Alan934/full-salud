import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../../common/bases/base.service';
import {
  CreatePatientUserConnectionDto,
  UpdatePatientUserConnectionDto
} from '../../domain/dtos';
import { PatientUserConnection } from '../../domain/entities';
import { Repository } from 'typeorm';

@Injectable()
export class PatientsUsersConnectionsService extends BaseService<
  PatientUserConnection,
  CreatePatientUserConnectionDto,
  UpdatePatientUserConnectionDto
> {
  constructor(
    @InjectRepository(PatientUserConnection)
    protected repository: Repository<PatientUserConnection>
  ) {
    super(repository);
  }
}
