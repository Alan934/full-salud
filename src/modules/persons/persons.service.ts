import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../../common/bases/base.service';
import { ErrorManager } from '../../common/exceptions/error.manager';
import { CreatePersonDto, UpdatePersonDto } from '../../domain/dtos';
import { Person } from '../../domain/entities';
import { EntityManager, Repository } from 'typeorm';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class PersonsService extends BaseService<
  Person,
  CreatePersonDto,
  UpdatePersonDto
> {
  constructor(
    @InjectRepository(Person) protected repository: Repository<Person>,
    @Inject() protected authService: AuthService
  ) {
    super(repository);
  }

  async removeWithManager(id: string, manager: EntityManager) {
    try {
      const entity = await manager.findOne(Person, {
        where: { id }
      });
      await manager.remove(Person, entity);
      await this.authService.removeWithManager(entity.user.id, manager);
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async softRemoveWithManager(id: string, manager: EntityManager) {
    try {
      const entity = await manager.findOne(Person, {
        where: { id }
      });
      await this.authService.softRemoveWithManager(entity.user.id, manager);
      await manager.softRemove(Person, entity);
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async restoreWithManager(
    id: string,
    manager: EntityManager
  ): Promise<Person> {
    try {
      const entity = await manager.findOne(Person, {
        where: { id },
        withDeleted: true
      });
      await this.authService.restoreWithManager(entity.user.id, manager);
      return await manager.recover(Person, entity);
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }
}
