import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ImageBase } from './image-base.entity';
import { Turn } from './turn.entity';

@Entity('derivation_images')
export class DerivationImage extends ImageBase {
  @ManyToOne(() => Turn, {
    onDelete: 'SET NULL'
  })
  @JoinColumn({ name: 'turn_id' })
  turn?: Turn;
}
