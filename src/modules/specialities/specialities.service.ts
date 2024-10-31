import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../../common/bases/base.service';
import { CreateSpecialityDto, UpdateSpecialityDto } from '../../domain/dtos';
import { Speciality } from '../../domain/entities';
import { Repository } from 'typeorm';

@Injectable()
export class SpecialitiesService extends BaseService<
  Speciality,
  CreateSpecialityDto,
  UpdateSpecialityDto
> {
  constructor(
    @InjectRepository(Speciality) protected repository: Repository<Speciality>
  ) {
    super(repository);
  }
}
