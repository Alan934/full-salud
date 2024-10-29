import { Controller } from '@nestjs/common';
import { DiagnosticsService } from './diagnostics.service';
import { Diagnostic } from 'src/domain/entities';
import { ControllerFactory } from 'src/common/factories/controller.factory';
import {
  CreateDiagnosticDto,
  SerializerDiagnosticDto,
  UpdateDiagnosticDto
} from 'src/domain/dtos';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Diagnostics')
@Controller('diagnostics')
export class DiagnosticsController extends ControllerFactory<
  Diagnostic,
  CreateDiagnosticDto,
  UpdateDiagnosticDto,
  SerializerDiagnosticDto
>(
  Diagnostic,
  CreateDiagnosticDto,
  UpdateDiagnosticDto,
  SerializerDiagnosticDto
) {
  constructor(protected service: DiagnosticsService) {
    super();
  }
}
