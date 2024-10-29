import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ImageBase } from './image-base.entity';
import { DisabilityCard } from '.';

@Entity('disability_card_images')
export class DisabilityCardImage extends ImageBase {
  @ManyToOne(() => DisabilityCard, {
    onDelete: 'SET NULL'
  })
  @JoinColumn({ name: 'disability_card_id' })
  disabilityCard?: DisabilityCard;
}
