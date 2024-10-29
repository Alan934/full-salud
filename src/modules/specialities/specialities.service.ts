import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/bases/base.service';
import { CreateSpecialityDto, UpdateSpecialityDto } from 'src/domain/dtos';
import { Speciality } from 'src/domain/entities';
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
