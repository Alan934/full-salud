import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AppointmentSlot } from '../../domain/entities';
import { Repository } from 'typeorm';
import { BaseService } from '../../common/bases/base.service';
import { CreateAppointmentSlotDto, UpdateAppointmentSlotDto } from '../../domain/dtos';
import { ErrorManager } from '../../common/exceptions/error.manager';
import { PaginationMetadata, getPagingData } from '../../common/util/pagination-data.util';
import { FilteredAppointmentSlotDto } from '../../domain/dtos/appointment-slot/FilteredAppointmentSlot.dto';
import { PaginationDto } from '../../common/dtos';

@Injectable()
export class AppointmentSlotService extends BaseService<
  AppointmentSlot,
  CreateAppointmentSlotDto,
  UpdateAppointmentSlotDto
> {
  constructor(
    @InjectRepository(AppointmentSlot) protected repository: Repository<AppointmentSlot>
  ) {
    super(repository);
  }

  async findOne(id: string): Promise<AppointmentSlot> {
    try {
      const slot = await this.repository.findOne({
        where: { id, deletedAt: null },
      });
      if (!slot) {
        throw ErrorManager.createSignatureError(`AppointmentSlot with id ${id} not found`);
      }
      return slot;
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async create(createSlotDto: CreateAppointmentSlotDto): Promise<AppointmentSlot> {
    try {
      const newSlot = this.repository.create(createSlotDto);
      const saved = await this.repository.save(newSlot);
      return await this.findOne(saved.id);
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async update(id: string, updateSlotDto: UpdateAppointmentSlotDto): Promise<AppointmentSlot> {
    try {
      const slot = await this.findOne(id);
      const updated = Object.assign(slot, updateSlotDto);
      await this.repository.save(updated);
      return await this.findOne(id);
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async remove(id: string): Promise<string> {
    try {
      const slot = await this.findOne(id);
      await this.repository.remove(slot);
      return `AppointmentSlot with id ${id} has been permanently deleted.`;
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async softRemove(id: string): Promise<string> {
    try {
      const slot = await this.findOne(id);
      await this.repository.softRemove(slot);
      return `AppointmentSlot with id ${id} has been soft deleted.`;
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async restore(id: string): Promise<AppointmentSlot> {
    try {
      const slot = await this.repository.findOne({
        where: { id },
        withDeleted: true,
      });
      if (!slot) {
        throw ErrorManager.createSignatureError(`AppointmentSlot with id ${id} not found`);
      }
      return await this.repository.recover(slot);
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async findAll(
    paginationDto: PaginationDto
  ): Promise<{ data: AppointmentSlot[]; meta: PaginationMetadata }> {
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
  ): Promise<{ data: AppointmentSlot[]; meta: PaginationMetadata }> {
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
    filteredDto: FilteredAppointmentSlotDto,
    paginationDto: PaginationDto
  ): Promise<{ data: AppointmentSlot[]; meta: PaginationMetadata; msg: string }> {
    try {
      const { page, limit } = paginationDto;
      const { day, openingHour, closeHour } = filteredDto;
      
      const queryBuilder = this.repository.createQueryBuilder('slot');
      
      if (day) {
        queryBuilder.andWhere('slot.day = :day', { day });
      }
      if (openingHour) {
        queryBuilder.andWhere('slot.openingHour >= :openingHour', { openingHour });
      }
      if (closeHour) {
        queryBuilder.andWhere('slot.closeHour <= :closeHour', { closeHour });
      }
      
      queryBuilder.skip((page - 1) * limit).take(limit);
      const [data, total] = await queryBuilder.getManyAndCount();
      const meta = getPagingData(data, page, limit);
      return { data, meta, msg: 'Filtered appointment slots retrieved successfully' };
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }
}