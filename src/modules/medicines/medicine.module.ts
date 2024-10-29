import { Module } from '@nestjs/common';
import { MedicineService } from './medicine.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Medicine } from 'src/domain/entities';
import { MedicineController } from './medicine.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Medicine])],
  controllers: [MedicineController],
  providers: [MedicineService]
})
export class MedicineModule {}
