import { Module } from '@nestjs/common';
import { ValueAddedTaxService } from './ValueAddedTax.service';
import { ValueAddedTaxController } from './ValueAddedTax.controller';
import { ValueAddedTax  } from '../../domain/entities';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ValueAddedTax ])],
  controllers: [ValueAddedTaxController],
  providers: [ValueAddedTaxService]
})
export class ValueAddedTaxModule {}
