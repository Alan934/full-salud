import { Module } from '@nestjs/common';
import { SocialWorksService } from './social_works.service';
import { SocialWorksController } from './social_works.controller';
import { SocialWork } from 'src/domain/entities';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([SocialWork])],
  controllers: [SocialWorksController],
  providers: [SocialWorksService]
})
export class SocialWorksModule {}
