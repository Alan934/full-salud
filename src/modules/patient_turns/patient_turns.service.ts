import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../../common/bases/base.service';
import { ErrorManager } from '../../common/exceptions/error.manager';
import {
  Conditions,
  DynamicQueryBuilder
} from '../../common/util/dynamic-query-builder.util';
import {
  getPagingData,
  PaginationMetadata
} from '../../common/util/pagination-data.util';
import {
  CreatePatientTurnDto,
  PatientTurnPaginationDto,
  UpdatePatientTurnDto
} from '../../domain/dtos';
import {
  ClinicalHistoryAccess,
  PatientTurn,
  Patient
} from '../../domain/entities';
import { Gender } from '../../domain/enums';
import { EntityManager, Repository, SelectQueryBuilder } from 'typeorm';
import { DisabilityCardsService } from '../disability_cards/disability_cards.service';
import { TurnsService } from '../turns/turns.service';
import { PatientService } from '../patients/patients.service';

@Injectable()
export class PatientTurnsService extends BaseService<
  PatientTurn,
  CreatePatientTurnDto,
  UpdatePatientTurnDto
> {
  constructor(
    @InjectRepository(PatientTurn)
    protected repository: Repository<PatientTurn>,
    @Inject() protected readonly patientService: PatientService,
    @Inject() protected readonly disabilityCardService: DisabilityCardsService,
    @Inject() protected readonly turnsService: TurnsService
  ) {
    super(repository);
  }

  //condiciones que se agregarán al query builder para filtrar los patient turn
  private patientTurnConditions: Conditions<PatientTurn> = {
    name: (queryBuilder: SelectQueryBuilder<PatientTurn>, value: string) =>
      queryBuilder.andWhere('person.name LIKE :name', { name: `%${value}%` }),
    lastName: (queryBuilder: SelectQueryBuilder<PatientTurn>, value: string) =>
      queryBuilder.andWhere('person.last_name LIKE :lastName', {
        lastName: `%${value}%`
      }),
    dni: (queryBuilder: SelectQueryBuilder<PatientTurn>, value: string) =>
      queryBuilder.andWhere('person.dni LIKE :dni', { dni: `%${value}%` }),
    gender: (queryBuilder: SelectQueryBuilder<PatientTurn>, value: Gender) =>
      queryBuilder.andWhere('person.gender = :gender', { gender: value }),

    birth: (queryBuilder: SelectQueryBuilder<PatientTurn>, value: Date) =>
      queryBuilder.andWhere(
        'DATE(person.birth) = :birth',
        { birth: value.toISOString().split('T')[0] } // La consulta se hace 2000-08-20T00:00:00.000Z, por eso se obtiene solo lo que está delante de T, para que compare bien
      ),

    socialWork: (
      queryBuilder: SelectQueryBuilder<PatientTurn>,
      value: string
    ) =>
      queryBuilder.andWhere('social_work.id = :socialWorkId', {
        socialWorkId: value
      }),

    isDisabled: (
      queryBuilder: SelectQueryBuilder<PatientTurn>,
      value: boolean
    ) =>
      queryBuilder.andWhere('patient_turn.is_disabled = :isDisabled', {
        isDisabled: value
      })
  };

  //Override del método base findAll para filtrar por propiedades
  override async findAll(
    paginationDto: PatientTurnPaginationDto
  ): Promise<{ data: PatientTurn[]; meta: PaginationMetadata }> {
    try {
      const { page, limit } = paginationDto;

      console.log('Valores de búsqueda', paginationDto);
      //crea un query builder base para traer la entidad con las relaciones que necesita el Serializer
      const queryBuilderBase = this.repository
        .createQueryBuilder('patient_turn')
        // Se establece relación con person
        .leftJoinAndSelect('patient_turn.person', 'person')
        // Se establece relación con member_social_works
        .leftJoinAndSelect(
          'patient_turn.memberSocialWork',
          'member_social_works'
        )
        // Se establece relación con social work desde member_social_works
        .leftJoinAndSelect('member_social_works.socialWork', 'social_work');

      // Si socialWorkId no es nulo en la query
      if (paginationDto.socialWorkId) {
        queryBuilderBase.andWhere('social_work.id = :socialWorkId', {
          socialWorkId: paginationDto.socialWorkId
        });
      }

      //añade las condiciones where al query builder
      const query = DynamicQueryBuilder.buildSelectQuery<PatientTurn>(
        queryBuilderBase,
        this.patientTurnConditions,
        paginationDto
      );

      //añade la paginación al query creada
      query.skip((page - 1) * limit).take(limit);

      //ejecuta la query
      const entities = await query.getMany();

      //retorna los resultados
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
          if (entity.disabilityCard) {
            //elimina el carnet de discapacidad
            await this.disabilityCardService.removeWithManager(
              entity.disabilityCard.id,
              manager
            );
          }
          await this.turnsService.removeByPatientWithManager(
            entity.id,
            manager
          ); //elimina turnos
          await this.patientService.removeWithManager(entity.id, manager);
          await manager.remove(entity);
          return `Entity with id ${id} deleted`;
        }
      );
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  // override async softRemove(id: string): Promise<string> {
  //   try {
  //     const entity = await this.findOne(id);
  //     return this.repository.manager.transaction(
  //       async (manager: EntityManager) => {
  //         await this.patientService.softRemoveWithManager(
  //           entity.person.id,
  //           manager
  //         );
  //         await manager.softDelete(ClinicalHistoryAccess, {
  //           patientTurn: entity
  //         });
  //         await manager.softDelete(Patient, {
  //           patientTurn: entity
  //         });
  //         await manager.softRemove(entity);
  //         return `Entity with id ${id} soft deleted`;
  //       }
  //     );
  //   } catch (error) {
  //     throw ErrorManager.createSignatureError((error as Error).message);
  //   }
  // }

  // override async restore(id: string): Promise<PatientTurn> {
  //   try {
  //     const entity = await this.repository.findOne({
  //       where: { id },
  //       withDeleted: true
  //     });

  //     return this.repository.manager.transaction(
  //       async (manager: EntityManager) => {
  //         const recovered = await manager.recover(entity);
  //         await this.patientService.restoreWithManager(
  //           entity.person.id,
  //           manager
  //         );
  //         await manager.restore(ClinicalHistoryAccess, { patientTurn: entity });
  //         await manager.restore(Patient, { patientTurn: entity });
  //         return recovered;
  //       }
  //     );
  //   } catch (error) {
  //     throw ErrorManager.createSignatureError((error as Error).message);
  //   }
  // }
}
