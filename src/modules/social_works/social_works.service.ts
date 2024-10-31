import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../../common/bases/base.service';
import { CreateSocialWorkDto, UpdateSocialWorkDto } from '../../domain/dtos';
import { SocialWork } from '../../domain/entities';
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
