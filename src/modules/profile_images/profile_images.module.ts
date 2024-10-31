import { Module } from '@nestjs/common';
import { ProfileImagesService } from './profile_images.service';
import { ProfileImagesController } from './profile_images.controller';
import { ProfileImage } from '../../domain/entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { cloundinaryProvider } from '../../config/cloudinary.providers';

@Module({
  imports: [TypeOrmModule.forFeature([ProfileImage])],
  controllers: [ProfileImagesController],
  providers: [ProfileImagesService, cloundinaryProvider],
  exports: [ProfileImagesService]
})
export class ProfileImagesModule {}
