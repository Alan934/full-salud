import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../../common/bases/base.service';
import { CreateMedicineDto, UpdateMedicineDto } from '../../domain/dtos';
import { Medicine } from '../../domain/entities';
import { Repository } from 'typeorm';

@Injectable()
export class MedicineService extends BaseService<
  Medicine,
  CreateMedicineDto,
  UpdateMedicineDto
> {
  constructor(
    @InjectRepository(Medicine)
    protected repository: Repository<Medicine>
  ) {
    super(repository);
  }
}
