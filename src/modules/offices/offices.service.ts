import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../../common/bases/base.service';
import { ErrorManager } from '../../common/exceptions/error.manager';
import { CreateOfficeDto, UpdateOfficeDto } from '../../domain/dtos';
import {
  Address,
  Office,
  SpecialistAttentionHour,
  SpecialistSecretary
} from '../../domain/entities';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class OfficesService extends BaseService<
  Office,
  CreateOfficeDto,
  UpdateOfficeDto
> {
  constructor(
    @InjectRepository(Office) protected repository: Repository<Office>
  ) {
    super(repository);
  }

  override async remove(id: string): Promise<string> {
    try {
      const entity = await this.findOne(id);
      const attentionHours = await entity.specialistAttentionHours;
      const secretary = await entity.secretary;
      return this.repository.manager.transaction(
        async (manager: EntityManager) => {
          if (attentionHours.length !== 0) {
            attentionHours.forEach(async (element) => {
              await manager.delete(SpecialistAttentionHour, element.id);
            });
          }
          if (secretary) {
            await manager.delete(SpecialistSecretary, secretary.id);
          }
          await manager.delete(Office, id);
          if (entity.address) {
            await manager.delete(Address, entity.address.id);
          }
          return `Entity with id ${id} deleted`;
        }
      );
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  override async softRemove(id: string): Promise<string> {
    try {
      const entity = await this.findOne(id);
      const attentionHours: SpecialistAttentionHour[] =
        await entity.specialistAttentionHours;
      const secretary: SpecialistSecretary = await entity.secretary;
      return this.repository.manager.transaction(
        async (manager: EntityManager) => {
          if (attentionHours.length !== 0) {
            attentionHours.forEach(async (element) => {
              await manager.softDelete(SpecialistAttentionHour, element.id);
            });
          }
          if (secretary) {
            await manager.softDelete(SpecialistSecretary, secretary.id);
          }
          await manager.softRemove(entity);
          return `Entity with id ${id} soft deleted`;
        }
      );
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  override async restore(id: string): Promise<Office> {
    try {
      const entity = await this.repository.findOne({
        where: { id },
        relations: ['specialistAttentionHours', 'secretary'],
        withDeleted: true
      });
      const attentionHours = await entity.specialistAttentionHours;
      const secretary = await entity.secretary;
      // Si 'entity' es null, devuelve una excepción como que la entidad no existe o no ha sido eliminada anteriormente
      if (!entity) {
        throw new ErrorManager(`Entity with id ${id} not found`, 404);
      }

      return this.repository.manager.transaction(
        async (manager: EntityManager) => {
          const recoveredEntity = await manager.recover(entity);
          if (attentionHours.length !== 0) {
            attentionHours.forEach(async (element) => {
              await manager.restore(SpecialistAttentionHour, element.id);
            });
          }
          if (secretary) {
            await manager.restore(SpecialistSecretary, secretary.id);
          }
          return recoveredEntity;
        }
      );
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }
}
