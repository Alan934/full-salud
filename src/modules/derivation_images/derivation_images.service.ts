import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ImagesBaseService } from 'src/common/bases/images-base/images-base.service';
import { DerivationImage } from 'src/domain/entities';
import { Repository } from 'typeorm';

@Injectable()
export class DerivationImagesService extends ImagesBaseService<DerivationImage> {
  constructor(
    @InjectRepository(DerivationImage)
    protected repository: Repository<DerivationImage>
  ) {
    super(repository, 'Derivations');
  }
}
