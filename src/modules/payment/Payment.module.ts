import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from '../../domain/entities';
import { PaymentController } from './Payment.controller';
import { PaymentService } from './Payment.service';

@Module({
  imports: [TypeOrmModule.forFeature([Payment])],
  controllers: [PaymentController],
  providers: [PaymentService]
})
export class PaymentModule {}
