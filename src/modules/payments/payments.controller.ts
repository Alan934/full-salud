import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ControllerFactory } from '../../common/factories/controller.factory';
import {
  CreatePaymentDto,
  UpdatePaymentDto,
  SerializerPaymentDto
} from '../../domain/dtos';
import { Payment } from '../../domain/entities';
import { PaymentsService } from './payments.service';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController extends ControllerFactory<
  Payment,
  CreatePaymentDto,
  UpdatePaymentDto,
  SerializerPaymentDto
>(Payment, CreatePaymentDto, UpdatePaymentDto, SerializerPaymentDto) {
  constructor(protected service: PaymentsService) {
    super();
  }
}
