import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RelatedPerson } from '../../domain/entities/related-person.entity';
import { Repository } from 'typeorm';
import { CreateRelatedPersonDto, UpdateRelatedPersonDto } from '../../domain/dtos';
import { ErrorManager } from '../../common/exceptions/error.manager';

@Injectable()
export class RelatedPersonService {
  constructor(
    @InjectRepository(RelatedPerson)
    private readonly repository: Repository<RelatedPerson>,
  ) {}

  async findAll(): Promise<RelatedPerson[]> {
    try {
      return await this.repository.find({ where: { deletedAt: null } });
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async findOne(id: string): Promise<RelatedPerson> {
    try {
      const relatedPerson = await this.repository.findOne({ where: { id, deletedAt: null } });
      if (!relatedPerson) {
        throw ErrorManager.createSignatureError(`RelatedPerson with id ${id} not found`);
      }
      return relatedPerson;
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async create(createDto: CreateRelatedPersonDto): Promise<RelatedPerson> {
    try {
      const newRelatedPerson = this.repository.create(createDto);
      const saved = await this.repository.save(newRelatedPerson);
      return await this.findOne(saved.id);
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async update(id: string, updateDto: UpdateRelatedPersonDto): Promise<RelatedPerson> {
    try {
      const relatedPerson = await this.findOne(id);
      const updated = Object.assign(relatedPerson, updateDto);
      await this.repository.save(updated);
      return await this.findOne(id);
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async remove(id: string): Promise<string> {
    try {
      const relatedPerson = await this.findOne(id);
      await this.repository.remove(relatedPerson);
      return `RelatedPerson with id ${id} has been permanently deleted.`;
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async softRemove(id: string): Promise<string> {
    try {
      const relatedPerson = await this.findOne(id);
      await this.repository.softRemove(relatedPerson);
      return `RelatedPerson with id ${id} has been soft deleted.`;
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async restore(id: string): Promise<RelatedPerson> {
    try {
      const relatedPerson = await this.repository.findOne({ where: { id }, withDeleted: true });
      if (!relatedPerson) {
        throw ErrorManager.createSignatureError(`RelatedPerson with id ${id} not found`);
      }
      return await this.repository.recover(relatedPerson);
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }
}
