import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/bases/base.service';
import { CreateSocialWorkDto, UpdateSocialWorkDto } from 'src/domain/dtos';
import { SocialWork } from 'src/domain/entities';
import { Repository } from 'typeorm';

@Injectable()
export class SocialWorksService extends BaseService<
  SocialWork,
  CreateSocialWorkDto,
  UpdateSocialWorkDto
> {
  constructor(
    @InjectRepository(SocialWork) protected repository: Repository<SocialWork>
  ) {
    super(repository);
  }
}
