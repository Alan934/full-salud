import { Module } from '@nestjs/common';
import { CategoryService } from './Category.service';
import { CategoryController } from './Category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../../domain/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [CategoryController],
  providers: [CategoryService]
})
export class CategoryModule {}
