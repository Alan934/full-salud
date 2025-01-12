import { Injectable, Inject, forwardRef, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../../common/bases/base.service';
import { CreateSpecialityDto, UpdateSpecialityDto } from '../../domain/dtos';
import { Speciality } from '../../domain/entities';
import { EntityManager, Repository } from 'typeorm';
import { AuthService } from '../auth/auth.service';
import { ErrorManager } from 'src/common/exceptions/error.manager';

@Injectable()
export class SpecialitiesService extends BaseService<
  Speciality,
  CreateSpecialityDto,
  UpdateSpecialityDto
> {
  constructor(
    @InjectRepository(Speciality) protected specialityRepository: Repository<Speciality>,
    @Inject(forwardRef(() => AuthService)) protected authService: AuthService
  ) {
    super(specialityRepository);
  }

  async createSpeciality(createSpecialityDto: CreateSpecialityDto): Promise<Speciality> {
    try {
      const newSpeciality = this.specialityRepository.create(createSpecialityDto);
      return await this.specialityRepository.save(newSpeciality);
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async getOne(id: string): Promise<Speciality> {
    try {
      const speciality = await this.specialityRepository.findOne({
        where: { id, deletedAt: null },
        relations: ['tags'],
      });

      if (!speciality) {
        throw new NotFoundException(`Speciality with ID ${id} not found`);
      }

      return speciality;
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async getAll(): Promise<Speciality[]> {
    try {
      return await this.specialityRepository.find({
        where: { deletedAt: null },
        relations: ['tags'],
      });
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async updateSpeciality(id: string, updateSpecialityDto: UpdateSpecialityDto): Promise<Speciality> {
    try {
      const speciality = await this.getOne(id);

      Object.assign(speciality, updateSpecialityDto);
      return await this.specialityRepository.save(speciality);
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async softDelete(id: string): Promise<void> {
    try {
      const speciality = await this.getOne(id);
      await this.specialityRepository.softRemove(speciality);
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async recoverSpeciality(id: string): Promise<Speciality> {
    try {
      const speciality = await this.specialityRepository.findOne({
        where: { id },
        withDeleted: true,
      });

      if (!speciality) {
        throw new NotFoundException(`Speciality with ID ${id} not found or not deleted`);
      }

      await this.specialityRepository.recover(speciality);
      return speciality;
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async removeWithManager(id: string, manager: EntityManager) {
    try {
      const entity = await manager.findOne(Speciality, {
        where: { id },
      });
      await manager.remove(Speciality, entity);
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async softRemoveWithManager(id: string, manager: EntityManager) {
    try {
      const entity = await manager.findOne(Speciality, {
        where: { id },
      });
      await manager.softRemove(Speciality, entity);
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async restoreWithManager(id: string, manager: EntityManager): Promise<Speciality> {
    try {
      const entity = await manager.findOne(Speciality, {
        where: { id },
        withDeleted: true,
      });
      return await manager.recover(Speciality, entity);
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }
}
