import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ControllerFactory } from '../../common/factories/controller.factory';
import {
  SerializerFinancialTransactionDto,
  CreateFinancialTransactionDto,
  UpdateFinancialTransactionDto
} from '../../domain/dtos';
import { FinancialTransaction } from '../../domain/entities/FinancialTransaction.entity';
import { FinancialTransactionService } from './FinancialTransaction.service';

@ApiTags('FinancialTransaction')
@Controller('financial-transaction')
export class FinancialTransactionController extends ControllerFactory<
  FinancialTransaction,
  CreateFinancialTransactionDto,
  UpdateFinancialTransactionDto,
  SerializerFinancialTransactionDto
>(
  FinancialTransaction,
  CreateFinancialTransactionDto,
  UpdateFinancialTransactionDto,
  SerializerFinancialTransactionDto
) {
  constructor(protected service: FinancialTransactionService) {
    super();
  }
}
