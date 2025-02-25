import { Module } from '@nestjs/common';
import { CountryService } from './Country.service';
import { CountryController } from './Country.controller';
import { Country } from '../../domain/entities';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Country])],
  controllers: [CountryController],
  providers: [CountryService]
})
export class CountryModule {}
