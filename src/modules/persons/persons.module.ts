import { Module } from '@nestjs/common';
import { PersonsService } from './persons.service';
import { Person } from '../../domain/entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Person]), AuthModule],
  controllers: [],
  providers: [PersonsService],
  exports: [PersonsService]
})
export class PersonsModule {}
