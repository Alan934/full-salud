import { Controller, Get, Param, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ControllerFactory } from '../../common/factories/controller.factory';
import {
  CreateBranchDto,
  SerializerBranchDto,
  UpdateBranchDto
} from '../../domain/dtos';
import { Branch } from '../../domain/entities';
import { BranchService } from './branch.service';
import { toDto } from '../../common/util/transform-dto.util';
import { AuthGuard, Roles, RolesGuard } from '../auth/guards/auth.guard';
import { Role } from '../../domain/enums';

@ApiTags('Branch')
@Controller('branch')
export class BranchController extends ControllerFactory<
  Branch,
  CreateBranchDto,
  UpdateBranchDto,
  SerializerBranchDto
>(
  Branch,
  CreateBranchDto,
  UpdateBranchDto,
  SerializerBranchDto
) {
  constructor(protected service: BranchService) {
    super();
  }

  @Roles(Role.PRACTITIONER, Role.ADMIN, Role.PATIENT)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('bearerAuth')
  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    const data = await this.service.findOne(id);
    return toDto(SerializerBranchDto, data) as unknown as SerializerBranchDto;
  }
}
