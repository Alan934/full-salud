import { Entity } from 'typeorm';
import { ImageBase } from './image-base.entity';

@Entity('profile_images')
export class ProfileImage extends ImageBase {}
