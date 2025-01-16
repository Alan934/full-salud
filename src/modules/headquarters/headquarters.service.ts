import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../../common/bases/base.service';
import { ErrorManager } from '../../common/exceptions/error.manager';
import { CreateHeadquartersDto, UpdateHeadquartersDto } from '../../domain/dtos';
import { Address, AttentionHour, Headquarters } from '../../domain/entities';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class HeadquartersService extends BaseService<
  Headquarters,
  CreateHeadquartersDto,
  UpdateHeadquartersDto
> {
  constructor(
    @InjectRepository(Headquarters)
    protected repository: Repository<Headquarters>,
  ) {
    super(repository);
  }

  override async remove(id: string): Promise<string> {
    try {
      const entity = await this.findOne(id);
      return this.repository.manager.transaction(
        async (manager: EntityManager) => {
          await manager.remove(Headquarters, entity);
          // await this.authService.removeWithManager(entity.id, manager);
          return `Entity with id ${id} deleted`;
        }
      );
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async removeWithManager(id: string, manager: EntityManager): Promise<string> {
    try {
      const entity = await manager.findOne(Headquarters, { where: { id } });
      await manager.delete(AttentionHour, { headquarters: entity });
      await manager.delete(Address, { id: entity.address.id });
      await manager.remove(Headquarters, entity);
      // await this.authService.removeWithManager(entity.id, manager);
      return `Entity with id ${id} deleted`;
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  override async softRemove(id: string): Promise<string> {
    try {
      const entity = await this.findOne(id);
      return this.repository.manager.transaction(
        async (manager: EntityManager) => {
          // await this.authService.softRemoveWithManager(entity.id, manager);
          await manager.softRemove(entity);
          return `Entity with id ${id} soft deleted`;
        }
      );
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async softRemoveWithManager(
    id: string,
    manager: EntityManager
  ): Promise<string> {
    try {
      const entity = await manager.findOne(Headquarters, { where: { id } });
      // await this.authService.softRemoveWithManager(entity.id, manager);
      await manager.softRemove(entity);
      return `Entity with id ${id} soft deleted`;
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  override async restore(id: string): Promise<Headquarters> {
    try {
      // Busca la entidad por su id donde  el campo deletedAt sea diferente a null
      const entity = await this.repository.findOne({
        where: { id },
        withDeleted: true
      });

      // Si 'entity' es null, devuelve una excepción como que la entidad no existe o no ha sido eliminada anteriormente
      if (!entity) {
        throw new ErrorManager(`Entity with id ${id} not found`, 404);
      }

      return this.repository.manager.transaction(
        async (manager: EntityManager) => {
          // await this.authService.restoreWithManager(entity.id, manager);
          return await manager.recover(entity);
        }
      );
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async restoreWithManager(
    id: string,
    manager: EntityManager
  ): Promise<Headquarters> {
    try {
      // Busca la entidad por su id donde  el campo deletedAt sea diferente a null
      const entity = await manager.findOne(Headquarters, {
        where: { id },
        withDeleted: true
      });

      // Si 'entity' es null, devuelve una excepción como que la entidad no existe o no ha sido eliminada anteriormente
      if (!entity) {
        throw new ErrorManager(`Entity with id ${id} not found`, 404);
      }

      // await this.authService.restoreWithManager(entity.id, manager);
      return await manager.recover(entity);
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }
}
