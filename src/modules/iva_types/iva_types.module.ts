import { Module } from '@nestjs/common';
import { IvaTypesService } from './iva_types.service';
import { IvaTypesController } from './iva_types.controller';
import { Iva } from 'src/domain/entities';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Iva])],
  controllers: [IvaTypesController],
  providers: [IvaTypesService]
})
export class IvaTypesModule {}
