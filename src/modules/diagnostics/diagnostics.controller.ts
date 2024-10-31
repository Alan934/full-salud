import { Controller } from '@nestjs/common';
import { DiagnosticsService } from './diagnostics.service';
import { Diagnostic } from '../../domain/entities';
import { ControllerFactory } from '../../common/factories/controller.factory';
import {
  CreateDiagnosticDto,
  SerializerDiagnosticDto,
  UpdateDiagnosticDto
} from '../../domain/dtos';
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
