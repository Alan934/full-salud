import { Module } from '@nestjs/common';
import { SocialWorkService } from './SocialWork.service';
import { SocialWorkController } from './SocialWork.controller';
import { SocialWork } from '../../domain/entities';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([SocialWork])],
  controllers: [SocialWorkController],
  providers: [SocialWorkService],
  exports: [SocialWorkService],
})
export class SocialWorkModule {}
