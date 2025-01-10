import { Injectable, Inject, forwardRef } from '@nestjs/common';
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

  async create(createSpecialityDto: CreateSpecialityDto): Promise<Speciality> {
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
        where: { id },
      });

      if (!speciality) {
        throw ErrorManager.createSignatureError(`Speciality with id ${id} not found`);
      }

      return speciality;
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async getAll(): Promise<Speciality[]> {
    try {
      return await this.specialityRepository.find();
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async update(id: string, updateSpecialityDto: UpdateSpecialityDto): Promise<Speciality> {
    try {
      const speciality = await this.getOne(id);

      const updatedSpeciality = this.specialityRepository.merge(speciality, updateSpecialityDto);
      return await this.specialityRepository.save(updatedSpeciality);
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async softDelete(id: string): Promise<string> {
    try {
      const speciality = await this.getOne(id);

      await this.specialityRepository.softRemove(speciality);
      return `Speciality with id ${id} has been soft deleted`;
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async restoreSpeciality(id: string, manager: EntityManager): Promise<Speciality> {
    try {
      const speciality = await manager.findOne(Speciality, {
        where: { id },
        withDeleted: true,
      });

      if (!speciality) {
        throw ErrorManager.createSignatureError(`Speciality with id ${id} not found or not deleted`);
      }

      return await manager.recover(Speciality, speciality);
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
