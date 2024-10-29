import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/bases/base.service';
import { CreateDiagnosticDto, UpdateDiagnosticDto } from 'src/domain/dtos';
import { Diagnostic } from 'src/domain/entities';
import { Repository } from 'typeorm';

@Injectable()
export class DiagnosticsService extends BaseService<
  Diagnostic,
  CreateDiagnosticDto,
  UpdateDiagnosticDto
> {
  constructor(
    @InjectRepository(Diagnostic) protected repository: Repository<Diagnostic>
  ) {
    super(repository);
  }
}
