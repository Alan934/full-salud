import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../../common/bases/base.service';
import {
  getPagingData,
  PaginationMetadata
} from '../../common/util/pagination-data.util';
import { ErrorManager } from '../../common/exceptions/error.manager';
import {
  Conditions,
  DynamicQueryBuilder
} from '../../common/util/dynamic-query-builder.util';
import {
  CreateSpecialistDto,
  SpecialistFilteredPaginationDto,
  UpdateSpecialistDto
} from '../../domain/dtos';
import {
  Degree,
  Prescription,
  Price,
  Specialist,
  SpecialistAttentionHour,
  Speciality,
  Turn
} from '../../domain/entities';
import { EntityManager, Repository, SelectQueryBuilder } from 'typeorm';
import { Gender } from '../../domain/enums';
// import { PersonsService } from '../persons/persons.service';

@Injectable()
export class SpecialistsService extends BaseService<
  Specialist,
  CreateSpecialistDto,
  UpdateSpecialistDto
> {
  constructor(
    @InjectRepository(Specialist) protected repository: Repository<Specialist>,
    //@Inject() protected personService: PersonsService
    @InjectRepository(Speciality) private readonly specialityRepository: Repository<Speciality>,
  ) {
    super(repository);
  }

  async create(createSpecialistDto: CreateSpecialistDto): Promise<Specialist> {
    try {
      const { specialities, degreeId, license, dni, phone, ...specialistData } = createSpecialistDto;
  
      const existingDni = await this.repository.findOne({ where: { dni } });
      if (existingDni) {
        throw new ErrorManager(`DNI "${dni}" already exists`, 400);
      }
  
      const existingPhone = await this.repository.findOne({ where: { phone } });
      if (existingPhone) {
        throw new ErrorManager(`Phone "${phone}" already exists`, 400);
      }
  
      const existingLicense = await this.repository.findOne({ where: { license } });
      if (existingLicense) {
        throw new ErrorManager(`License number "${license}" already exists`, 400);
      }
  
      const specialityEntities = await this.specialityRepository.findByIds(
        specialities.map((s) => s.id)
      );
      if (specialityEntities.length !== specialities.length) {
        throw new ErrorManager('Some specialties not found', 400);
      }

      const degreeEntity = await this.repository.manager.findOne(Degree, {
        where: { id: degreeId },
      });
      if (!degreeEntity) {
        throw new ErrorManager(`Degree with id "${degreeId}" not found`, 400);
      }
  
      const specialist = this.repository.create({
        ...specialistData,
        license,
        dni,
        degree: degreeEntity,
        specialities: specialityEntities,
      });
  
      return await this.repository.save(specialist);
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  // Obtener todos los especialistas
  async getAll(): Promise<Specialist[]> {
    try {
      return await this.repository.find({ where: { deletedAt: null } });
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  // Obtener un especialista por ID
  async getOne(id: string): Promise<Specialist> {
    try {
      const specialist = await this.repository.findOne({
        where: { id, deletedAt: null },
        relations: ['specialities', 'degree'],
      });

      if (!specialist) {
        throw new NotFoundException(`Specialist with ID ${id} not found`);
      }

      return specialist;
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  // Actualizar un especialista
  async update(id: string, updateSpecialistDto: UpdateSpecialistDto): Promise<Specialist> {
    try {
      const specialist = await this.getOne(id);

      const { specialities, degreeId, ...specialistData } = updateSpecialistDto;

      if (specialities) {
        const specialityEntities = await this.specialityRepository.findByIds(
          specialities.map((s) => s.id)
        );

        if (specialityEntities.length !== specialities.length) {
          throw new ErrorManager('Some specialties not found', 400);
        }

        specialist.specialities = specialityEntities;
      }

      if (degreeId) {
        const degreeEntity = await this.repository.manager.findOne(Degree, {
          where: { id: degreeId },
        });
        if (!degreeEntity) {
          throw new ErrorManager(`Degree with id "${degreeId}" not found`, 400);
        }
  
        specialist.degree = degreeEntity;
      }

      Object.assign(specialist, specialistData);

      return await this.repository.save(specialist);
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  // Eliminar especialista (soft delete)
  async softDelete(id: string): Promise<{ message: string }> {
    try {
      const specialist = await this.getOne(id);

      await this.repository.softRemove(specialist);

      return { message: 'Specialist soft deleted successfully' };
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  // Recuperar un especialista eliminado
  async recover(id: string): Promise<{ message: string }> {
    try {
      const specialist = await this.repository.findOne({
        where: { id },
        withDeleted: true,
      });

      if (!specialist || !specialist.deletedAt) {
        throw new NotFoundException(`Specialist with ID ${id} not found or not deleted`);
      }

      await this.repository.recover(specialist);

      return { message: 'Specialist recovered successfully' };
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  //condiciones que se agregarán al query builder para filtrar los patient turn
  private specialistConditions: Conditions<Specialist> = {
    name: (queryBuilder: SelectQueryBuilder<Specialist>, value: string) =>
      queryBuilder.andWhere('person.name LIKE :name', { name: `%${value}%` }),
    lastName: (queryBuilder: SelectQueryBuilder<Specialist>, value: string) =>
      queryBuilder.andWhere('person.last_name LIKE :lastName', {
        lastName: `%${value}%`
      }),
    dni: (queryBuilder: SelectQueryBuilder<Specialist>, value: string) =>
      queryBuilder.andWhere('person.dni LIKE :dni', { dni: `%${value}%` }),
    gender: (queryBuilder: SelectQueryBuilder<Specialist>, value: Gender) =>
      queryBuilder.andWhere('person.gender = :gender', { gender: value }),
    birth: (queryBuilder: SelectQueryBuilder<Specialist>, value: Date) =>
      queryBuilder.andWhere(
        '( YEAR(person.birth) = YEAR(:birth) ' +
          'AND MONTH(person.birth) = MONTH(:birth) ' +
          'AND DAY(person.birth) = DAY(:birth) ) ',
        { birth: value }
      ),
    homeService: (
      queryBuilder: SelectQueryBuilder<Specialist>,
      value: boolean
    ) =>
      queryBuilder.andWhere('specialist.home_service = :homeservice', {
        homeservice: value
      }),
    license: (queryBuilder: SelectQueryBuilder<Specialist>, value: string) =>
      queryBuilder.andWhere('specialist.license = :license', {
        license: value
      }),
    speciality: (queryBuilder: SelectQueryBuilder<Specialist>, value: string) =>
      queryBuilder.andWhere('speciality.id = :id', { id: value }),
    socialWorkId: (
      queryBuilder: SelectQueryBuilder<Specialist>,
      value: string
    ) => queryBuilder.andWhere('social_work.id = :id', { id: value }),
    degree: (queryBuilder: SelectQueryBuilder<Specialist>, value: string) =>
      queryBuilder.andWhere('degree.id = :id', { id: value })
  };

  //Override del método base findAll para filtrar por propiedades
  async findAll(
    paginationDto: SpecialistFilteredPaginationDto
  ): Promise<{ data: Specialist[]; meta: PaginationMetadata }> {
    try {
      const { page, limit } = paginationDto;
      //crea un query builder base para traer la entidad con las relaciones que necesita el Serializer
      const queryBuilderBase = this.repository
        .createQueryBuilder('specialist')
        .leftJoinAndSelect('specialist.person', 'person')
        .leftJoinAndSelect(
          'specialist.specialistAttentionHour',
          'specialistAttentionHour'
        )
        .leftJoinAndSelect('specialist.degree', 'degree')
        .leftJoinAndSelect('specialist.speciality', 'speciality')
        .leftJoinAndSelect('specialist.acceptedSocialWorks', 'social_work');

      //añade las condiciones where al query builder
      const query = DynamicQueryBuilder.buildSelectQuery<Specialist>(
        queryBuilderBase,
        this.specialistConditions,
        paginationDto
      );

      //añade la paginación al query creada
      query.skip((page - 1) * limit).take(limit);

      //ejecuta la query
      const entities = await query.getMany();

      //retorna los resultados
      console.log(entities);
      return {
        data: entities,
        meta: getPagingData(entities, page, limit)
      };
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  override async remove(id: string): Promise<string> {
    try {
      const entity = await this.findOne(id);
      return this.repository.manager.transaction(
        async (manager: EntityManager) => {
          await manager //eliminar el especialista de turno
            .createQueryBuilder()
            .update(Turn)
            .set({ specialist: null })
            .where('specialist_id = :id', { id: entity.id })
            .execute();
          await manager //eliminar el especialista de prescripcion
            .createQueryBuilder()
            .update(Prescription)
            .set({ specialist: null })
            .where('specialist_id = :id', { id: entity.id })
            .execute();
          await manager.delete(SpecialistAttentionHour, { specialist: entity });
          await manager.delete(Price, { specialist: entity });
          await manager.remove(Specialist, entity);
          //await this.personService.removeWithManager(entity.person.id, manager);
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
      return this.repository.manager.transaction(
        async (manager: EntityManager) => {
          await manager.softDelete(Price, { specialist: entity });
          // await this.personService.softRemoveWithManager(
          //   entity.person.id,
          //   manager
          // );
          await manager.softRemove(entity);
          return `Entity with id ${id} soft deleted`;
        }
      );
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  override async restore(id: string): Promise<Specialist> {
    try {
      const entity = await this.repository.findOne({
        where: { id },
        withDeleted: true
      });
      return this.repository.manager.transaction(
        async (manager: EntityManager) => {
          const recovered = await manager.recover(entity);
          // await this.personService.restoreWithManager(
          //   entity.person.id,
          //   manager
          // );
          await manager.restore(Price, { specialist: entity });
          return recovered;
        }
      );
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async findAllWithTurns(): Promise<Specialist[]> {
    try {
      return await this.repository
        .createQueryBuilder('specialist')
        .leftJoinAndSelect('specialist.person', 'person')
        .leftJoinAndSelect('specialist.specialistAttentionHour', 'specialistAttentionHour')
        .leftJoinAndSelect('specialist.degree', 'degree')
        .leftJoinAndSelect('specialist.speciality', 'speciality')
        .leftJoinAndSelect('specialist.acceptedSocialWorks', 'social_work')
        .leftJoinAndSelect('specialist.turns', 'turn')
        //.leftJoinAndSelect('turn.Patient', 'Patient') // Opcional: otras relaciones de Turn
        .getMany();
    } catch (error) {
      console.error('Error fetching specialists with turns:', error);
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  // async findTurnsBySpecialistId(specialistId: string): Promise<Turn[]> {
  //   try {
  //     const specialist = await this.repository
  //       .createQueryBuilder('specialist')
  //       .leftJoinAndSelect('specialist.turns', 'turn')
  //       .leftJoinAndSelect('turn.Patient', 'Patient')
  //       .where('specialist.id = :id', { id: specialistId })
  //       .getOne();
  
  //     if (!specialist) {
  //       throw new ErrorManager.createSignatureError(
  //         `Specialist with id ${specialistId} not found`
  //       );
  //     }
  
  //     return specialist.turns;
  //   } catch (error) {
  //     throw ErrorManager.createSignatureError((error as Error).message);
  //   }
  // }
  
}
