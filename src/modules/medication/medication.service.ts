import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Medication } from '../../domain/entities';
import { Repository } from 'typeorm';
import { BaseService } from '../../common/bases/base.service';
import { CreateMedicationDto, UpdateMedicationDto } from '../../domain/dtos';
import { ErrorManager } from '../../common/exceptions/error.manager';
import { PaginationMetadata, getPagingData } from '../../common/util/pagination-data.util';
import { PaginationDto } from '../../common/dtos';
import { FilteredMedicationDto } from '../../domain/dtos/medication/FilteredMedication.dto';

@Injectable()
export class MedicationService extends BaseService<Medication, CreateMedicationDto, UpdateMedicationDto> {
  constructor(
    @InjectRepository(Medication) protected repository: Repository<Medication>
  ) {
    super(repository);
  }

  async findOne(id: string): Promise<Medication> {
    try {
      const medication = await this.repository.findOne({ where: { id, deletedAt: null } });
      if (!medication) {
        throw ErrorManager.createSignatureError(`Medication with id ${id} not found`);
      }
      return medication;
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async create(createMedicationDto: CreateMedicationDto): Promise<Medication> {
    try {
      const newMedication = this.repository.create(createMedicationDto);
      const saved = await this.repository.save(newMedication);
      return await this.findOne(saved.id);
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async update(id: string, updateMedicationDto: UpdateMedicationDto): Promise<Medication> {
    try {
      const medication = await this.findOne(id);
      const updated = Object.assign(medication, updateMedicationDto);
      await this.repository.save(updated);
      return await this.findOne(id);
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async remove(id: string): Promise<string> {
    try {
      const medication = await this.findOne(id);
      await this.repository.remove(medication);
      return `Medication with id ${id} has been permanently deleted.`;
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async softRemove(id: string): Promise<string> {
    try {
      const medication = await this.findOne(id);
      await this.repository.softRemove(medication);
      return `Medication with id ${id} has been soft deleted.`;
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async restore(id: string): Promise<Medication> {
    try {
      const medication = await this.repository.findOne({
        where: { id },
        withDeleted: true,
      });
      if (!medication) {
        throw ErrorManager.createSignatureError(`Medication with id ${id} not found`);
      }
      return await this.repository.recover(medication);
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async findAll(
    paginationDto: PaginationDto
  ): Promise<{ data: Medication[]; meta: PaginationMetadata }> {
    try {
      const { page, limit } = paginationDto;
      const [data, total] = await this.repository.findAndCount({
        skip: (page - 1) * limit,
        take: limit,
        where: { deletedAt: null },
      });
      const meta = getPagingData(data, page, limit);
      return { data, meta };
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async findAllIncludeDeletes(
    paginationDto: PaginationDto
  ): Promise<{ data: Medication[]; meta: PaginationMetadata }> {
    try {
      const { page, limit } = paginationDto;
      const [data, total] = await this.repository.findAndCount({
        skip: (page - 1) * limit,
        take: limit,
        withDeleted: true,
      });
      const meta = getPagingData(data, page, limit);
      return { data, meta };
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async findAllFiltered(
    filteredDto: FilteredMedicationDto,
    paginationDto: PaginationDto
  ): Promise<{ data: Medication[]; meta: PaginationMetadata; msg: string }> {
    try {
      const { page, limit } = paginationDto;
      const queryBuilder = this.repository.createQueryBuilder('medication');
      
      if (filteredDto.name) {
        queryBuilder.andWhere('medication.name LIKE :name', { name: `%${filteredDto.name}%` });
      }
      
      queryBuilder.skip((page - 1) * limit).take(limit);
      const [data, total] = await queryBuilder.getManyAndCount();
      const meta = getPagingData(data, page, limit);
      return { data, meta, msg: 'Filtered medications retrieved successfully' };
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }
}