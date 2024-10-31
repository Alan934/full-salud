import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ImagesBaseService } from '../../common/bases/images-base/images-base.service';
import { ProfileImage } from '../../domain/entities';
import { Repository } from 'typeorm';

@Injectable()
export class ProfileImagesService extends ImagesBaseService<ProfileImage> {
  constructor(
    @InjectRepository(ProfileImage)
    protected repository: Repository<ProfileImage>
  ) {
    super(repository, 'Profile Images');
  }
}
