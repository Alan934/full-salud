import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../../common/bases/base.service';
import { ErrorManager } from '../../common/exceptions/error.manager';
import {
  CreateUserApplicationDto,
  UpdateUserApplicationDto
} from '../../domain/dtos';
import { UserApplication } from '../../domain/entities';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class UserApplicationsService extends BaseService<
  UserApplication,
  CreateUserApplicationDto,
  UpdateUserApplicationDto
> {
  constructor(
    @InjectRepository(UserApplication)
    protected repository: Repository<UserApplication>
  ) {
    super(repository);
  }

  async softRemoveWithManager(
    userApplicationId: string,
    entityManager: EntityManager
  ) {
    try {
      const UserApplication = await this.repository.findOne({
        where: { id: userApplicationId }
      }); // Obtiene el user application por el id

      await entityManager.softRemove(UserApplication); // Marca deletedAt
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async removeWithManager(
    userApplicationId: string,
    entityManager: EntityManager
  ) {
    try {
      const UserApplication = await this.repository.findOne({
        where: { id: userApplicationId }
      }); // Obtiene el user application por el id

      await entityManager.remove(UserApplication);
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async restoreWithManager(
    userApplicationId: string,
    entityManager: EntityManager
  ) {
    try {
      const UserApplication = await this.repository.findOne({
        where: { id: userApplicationId },
        withDeleted: true
      }); // Obtiene el user application eliminado por el id

      await entityManager.recover(UserApplication);
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }
}
