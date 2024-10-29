import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/bases/base.service';
import {
  CreateMemberSocialWorkDto,
  UpdateMemberSocialWorkDto
} from 'src/domain/dtos';
import { MemberSocialWork } from 'src/domain/entities';
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
