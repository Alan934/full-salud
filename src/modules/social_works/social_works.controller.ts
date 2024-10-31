import { Controller } from '@nestjs/common';
import { SocialWorksService } from './social_works.service';
import { SocialWork } from '../../domain/entities';
import { ControllerFactory } from '../../common/factories/controller.factory';
import {
  CreateSocialWorkDto,
  SerializerSocialWorkDto,
  UpdateSocialWorkDto
} from '../../domain/dtos';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Social Works')
@Controller('social-works')
export class SocialWorksController extends ControllerFactory<
  SocialWork,
  CreateSocialWorkDto,
  UpdateSocialWorkDto,
  SerializerSocialWorkDto
>(
  SocialWork,
  CreateSocialWorkDto,
  UpdateSocialWorkDto,
  SerializerSocialWorkDto
) {
  constructor(protected service: SocialWorksService) {
    super();
  }
}
