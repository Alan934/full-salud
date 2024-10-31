import { Controller } from '@nestjs/common';
import { ProfileImagesService } from './profile_images.service';
import { ApiTags } from '@nestjs/swagger';
import { ImagesBaseController } from '../../common/bases/images-base/images-base.controller';
import { ProfileImage } from '../../domain/entities';

@ApiTags('Profile Images')
@Controller('profile-images')
export class ProfileImagesController extends ImagesBaseController<ProfileImage> {
  constructor(private readonly profileImagesService: ProfileImagesService) {
    super(profileImagesService);
  }
}
