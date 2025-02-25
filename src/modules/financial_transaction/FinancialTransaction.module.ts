import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinancialTransaction } from '../../domain/entities';
import { FinancialTransactionController } from './FinancialTransaction.controller';
import { FinancialTransactionService } from './FinancialTransaction.service';

@Module({
  imports: [TypeOrmModule.forFeature([FinancialTransaction])],
  controllers: [FinancialTransactionController],
  providers: [FinancialTransactionService]
})
export class FinancialTransactionModule {}
