import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FinancialTransaction } from '../../domain/entities/financial-transaction.entity';
import { Repository } from 'typeorm';
import { CreateFinancialTransactionDto, UpdateFinancialTransactionDto } from '../../domain/dtos';
import { ErrorManager } from '../../common/exceptions/error.manager';

@Injectable()
export class FinancialTransactionService {
  constructor(
    @InjectRepository(FinancialTransaction)
    private readonly repository: Repository<FinancialTransaction>,
  ) {}

  async findAll(): Promise<FinancialTransaction[]> {
    try {
      return await this.repository.find({ where: { deletedAt: null } });
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async findOne(id: string): Promise<FinancialTransaction> {
    try {
      const transaction = await this.repository.findOne({ where: { id, deletedAt: null } });
      if (!transaction) {
        throw ErrorManager.createSignatureError(`FinancialTransaction with id ${id} not found`);
      }
      return transaction;
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async create(createDto: CreateFinancialTransactionDto): Promise<FinancialTransaction> {
    try {
      const newTransaction = this.repository.create(createDto);
      const saved = await this.repository.save(newTransaction);
      return await this.findOne(saved.id);
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async update(id: string, updateDto: UpdateFinancialTransactionDto): Promise<FinancialTransaction> {
    try {
      const transaction = await this.findOne(id);
      const updated = Object.assign(transaction, updateDto);
      await this.repository.save(updated);
      return await this.findOne(id);
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async remove(id: string): Promise<string> {
    try {
      const transaction = await this.findOne(id);
      await this.repository.remove(transaction);
      return `FinancialTransaction with id ${id} has been permanently deleted.`;
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async softRemove(id: string): Promise<string> {
    try {
      const transaction = await this.findOne(id);
      await this.repository.softRemove(transaction);
      return `FinancialTransaction with id ${id} has been soft deleted.`;
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async restore(id: string): Promise<FinancialTransaction> {
    try {
      const transaction = await this.repository.findOne({ where: { id }, withDeleted: true });
      if (!transaction) {
        throw ErrorManager.createSignatureError(`FinancialTransaction with id ${id} not found`);
      }
      return await this.repository.recover(transaction);
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }
}
