import { Module } from '@nestjs/common';
import { ProvinceService } from './Province.service';
import { ProvinceController } from './Province.controller';
import { Province } from '../../domain/entities';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Province])],
  controllers: [ProvinceController],
  providers: [ProvinceService]
})
export class ProvinceModule {}
