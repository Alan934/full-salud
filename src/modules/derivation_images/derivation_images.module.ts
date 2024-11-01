import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DerivationImage } from '../../domain/entities';
import { DerivationImagesController } from './derivation_images.controller';
import { DerivationImagesService } from './derivation_images.service';
import { cloundinaryProvider } from '../../config/cloudinary.providers';

@Module({
  imports: [TypeOrmModule.forFeature([DerivationImage])],
  controllers: [DerivationImagesController],
  providers: [DerivationImagesService, cloundinaryProvider],
  exports: [DerivationImagesService]
})
export class DerivationImagesModule {}
