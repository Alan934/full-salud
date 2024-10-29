import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/bases/base.service';
import { CreateMedicineDto, UpdateMedicineDto } from 'src/domain/dtos';
import { Medicine } from 'src/domain/entities';
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
