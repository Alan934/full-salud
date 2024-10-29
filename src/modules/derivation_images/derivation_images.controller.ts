import { Controller } from '@nestjs/common';
import { DerivationImagesService } from './derivation_images.service';
import { ApiTags } from '@nestjs/swagger';
import { ImagesBaseController } from 'src/common/bases/images-base/images-base.controller';
import { DerivationImage } from 'src/domain/entities';

@ApiTags('Derivation Images')
@Controller('derivation-images')
export class DerivationImagesController extends ImagesBaseController<DerivationImage> {
  constructor(
    private readonly derivationImageService: DerivationImagesService
  ) {
    super(derivationImageService);
  }
}
