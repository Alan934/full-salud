import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/bases/base.service';
import { CreatePaymentDto, UpdatePaymentDto } from 'src/domain/dtos';
import { Payment } from 'src/domain/entities';
import { Repository } from 'typeorm';

@Injectable()
export class PaymentsService extends BaseService<
  Payment,
  CreatePaymentDto,
  UpdatePaymentDto
> {
  constructor(
    @InjectRepository(Payment)
    protected repository: Repository<Payment>
  ) {
    super(repository);
  }
}
