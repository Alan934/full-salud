import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../../common/bases/base.service';
import {
  CreateMemberSocialWorkDto,
  UpdateMemberSocialWorkDto
} from '../../domain/dtos';
import { MemberSocialWork } from '../../domain/entities';
import { Repository } from 'typeorm';

@Injectable()
export class MembersSocialWorksService extends BaseService<
  MemberSocialWork,
  CreateMemberSocialWorkDto,
  UpdateMemberSocialWorkDto
> {
  constructor(
    @InjectRepository(MemberSocialWork)
    protected repository: Repository<MemberSocialWork>
  ) {
    super(repository);
  }
}
