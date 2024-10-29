import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DisabilityCard } from 'src/domain/entities';
import { DisabilityCardsController } from './disability_cards.controller';
import { DisabilityCardsService } from './disability_cards.service';
import { DisabilityCardImagesModule } from '../disability_card_images/disability_card_images.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([DisabilityCard]),
    DisabilityCardImagesModule
  ],
  controllers: [DisabilityCardsController],
  providers: [DisabilityCardsService],
  exports: [DisabilityCardsService]
})
export class DisabilityCardsModule {}
