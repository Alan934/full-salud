import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserApplication } from 'src/domain/entities';
import { UserApplicationsService } from './user_applications.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserApplication])],
  providers: [UserApplicationsService],
  exports: [UserApplicationsService]
})
export class UserApplicationsModule {}
