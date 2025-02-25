import { Module } from '@nestjs/common';
import { ChargeItemService } from './ChargeItem.service';
import { ChargeItemController } from './ChargeItem.controller';
import { ChargeItem } from '../../domain/entities';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ChargeItem])],
  controllers: [ChargeItemController],
  providers: [ChargeItemService]
})
export class ChargeItemModule {}
