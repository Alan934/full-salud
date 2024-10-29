import { Module } from '@nestjs/common';
import { MembersSocialWorksService } from './members-social-works.service';
import { MemberSocialWork } from 'src/domain/entities';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([MemberSocialWork])],
  controllers: [],
  providers: [MembersSocialWorksService]
})
export class MembersSocialWorksModule {}
