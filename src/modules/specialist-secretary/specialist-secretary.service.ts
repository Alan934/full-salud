import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../../common/bases/base.service';
import { ErrorManager } from '../../common/exceptions/error.manager';
import {
  CreateSpecialistSecretaryDto,
  UpdateSpecialistSecretaryDto
} from '../../domain/dtos';
import { Person, Specialist, SpecialistSecretary, Speciality, User } from '../../domain/entities';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class SpecialistSecretariesService extends BaseService<
  SpecialistSecretary,
  CreateSpecialistSecretaryDto,
  UpdateSpecialistSecretaryDto
> {
  constructor(
    @InjectRepository(SpecialistSecretary)
    protected repository: Repository<SpecialistSecretary>
  ) {
    super(repository);
  }

  override async remove(id: string): Promise<string> {
    try {
      const entity = await this.findOne(id);
      return this.repository.manager.transaction(
        async (manager: EntityManager) => {
          if (entity) {
            await manager.delete(SpecialistSecretary, id);
            await manager.delete(Specialist, entity.person);
            //await manager.delete(User, entity.person.user);
            return `Entity with id ${id} deleted`;
          }
        }
      );
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }
}
