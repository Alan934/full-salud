import { Module } from '@nestjs/common';
import { DisabilityCardImagesService } from './disability_card_images.service';
import { DisabilityCardImagesController } from './disability_card_images.controller';
import { DisabilityCardImage } from 'src/domain/entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { s3Provider } from 'src/config/aws-s3.provider';

@Module({
  imports: [TypeOrmModule.forFeature([DisabilityCardImage])],
  controllers: [DisabilityCardImagesController],
  providers: [DisabilityCardImagesService, s3Provider],
  exports: [DisabilityCardImagesService]
})
export class DisabilityCardImagesModule {}
