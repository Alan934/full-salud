import { Module } from '@nestjs/common';
import { AddressService } from './Address.service';
import { AddressController } from './Address.controller';
import { Address } from '../../domain/entities';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Address])],
  controllers: [AddressController],
  providers: [AddressService]
})
export class AddressModule {}
