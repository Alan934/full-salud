import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/bases/base.service';
import { ErrorManager } from 'src/common/exceptions/error.manager';
import {
  CreateSpecialistSecretaryDto,
  UpdateSpecialistSecretaryDto
} from 'src/domain/dtos';
import { Person, SpecialistSecretary, User } from 'src/domain/entities';
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
            await manager.delete(Person, entity.person);
            await manager.delete(User, entity.person.user);
            return `Entity with id ${id} deleted`;
          }
        }
      );
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }
}
