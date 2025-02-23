import { Module } from '@nestjs/common';
import { HeadquartersService } from './headquarters.service';
import { HeadquartersController } from './headquarters.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Headquarters } from '../../domain/entities';
// import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Headquarters])],
  providers: [HeadquartersService],
  controllers: [HeadquartersController],
  exports: [HeadquartersService]
})
export class HeadquartersModule {}
