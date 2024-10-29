import { Module } from '@nestjs/common';
import { ExamplesService } from './examples.service';
import { ExamplesController } from './examples.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Examples } from 'src/domain/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Examples])],
  controllers: [ExamplesController],
  providers: [ExamplesService]
})
export class ExamplesModule {}
