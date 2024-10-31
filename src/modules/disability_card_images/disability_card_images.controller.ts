import { Controller } from '@nestjs/common';
import { DisabilityCardImagesService } from './disability_card_images.service';
import { ApiTags } from '@nestjs/swagger';
import { DisabilityCardImage } from '../../domain/entities';
import { S3Controller } from '../../common/bases/images-base/aws/s3/s3.controller';

@ApiTags('Disability Card Images')
@Controller('disability-card-images')
export class DisabilityCardImagesController extends S3Controller<DisabilityCardImage> {
  constructor(
    private readonly disabilityCardImagesService: DisabilityCardImagesService
  ) {
    super(disabilityCardImagesService);
  }
}
