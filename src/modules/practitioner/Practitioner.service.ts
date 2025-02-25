import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
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
  ProfessionalDegree,
  Patient,
  Prescription,
  ChargeItem,
  Practitioner,
  PractitionerAppointment,
  PractitionerRole,
  Appointment,
  Location
} from '../../domain/entities';
import { EntityManager, Repository, SelectQueryBuilder } from 'typeorm';
import { Gender, Role } from '../../domain/enums';
import * as bcrypt from 'bcrypt';
// import { PersonsService } from '../persons/persons.service';
import axios from 'axios';
import { CreatePractitionerDto, UpdatePractitionerDto } from '../../domain/dtos/practitioner/Practitioner.dto';
import { PractitionerFilteredPaginationDto } from '../../domain/dtos/practitioner/Practitioner-filtered-pagination.dto';
import { AuthService } from '../auth/auth.service';
import { plainToInstance } from 'class-transformer';
import { SerializerPractitionerDto } from '../../domain/dtos';

@Injectable()
export class PractitionerService extends BaseService<
  Practitioner,
  CreatePractitionerDto,
  UpdatePractitionerDto
> {
  constructor(
    @InjectRepository(Practitioner) protected repository: Repository<Practitioner>,
    //@Inject() protected personService: PersonsService
    @InjectRepository(PractitionerRole) private readonly specialityRepository: Repository<PractitionerRole>,
    @InjectRepository(Patient) private readonly patientRepository: Repository<Patient>,
    @InjectRepository(Location) private readonly officeRepository: Repository<Location>,
    @InjectRepository(ProfessionalDegree) private readonly degreeRepository: Repository<ProfessionalDegree>,
    @Inject(forwardRef(() => AuthService)) private readonly authService: AuthService,
  ) {
    super(repository);
  }

  // Crear un nuevo especialista
  async createSpecialist(createSpecialistDto: CreatePractitionerDto) {
    try {
      const { password, dni, license, email, username, officeId, ...userData } = createSpecialistDto;
  
      // Validar en Specialist y Patient
      const existingUser = await this.repository.findOne({
        where: [{ dni }, { email }, { username }, { phone: userData.phone }],
      });

      const existingPatient = await this.patientRepository.findOne({
        where: [{ email }, { username }],
      });

      if (existingUser || existingPatient) {
        throw new ErrorManager(
          'User with provided DNI, email, username, or phone already exists',
          400,
        );
      }
  
      // Consultar SISA para validar al médico
      const sisaUrl = `https://sisa.msal.gov.ar/sisa/services/rest/profesional/obtener?nrodoc=${dni}&usuario=jlllado&clave=$FullSalud123`;
      const sisaResponse = await axios.get(sisaUrl);
      const sisaData = sisaResponse.data;  
 
      // Validar respuesta del SISA
      if (sisaData.resultado !== 'OK') {
        throw new ErrorManager('No valid professional found in SISA', 400);
      }
  
      if (sisaData.numeroDocumento !== dni) {
        throw new ErrorManager('DNI does not match with SISA records', 400);
      }
  
      // Validar si la matrícula proporcionada coincide con una habilitada en SISA
      const matriculas = Array.isArray(sisaData.matriculas)
        ? sisaData.matriculas
        : sisaData.matriculas
        ? [sisaData.matriculas]
        : [];
  
      const validMatricula = matriculas.find(
        (matricula) =>
          matricula.estado === 'Habilitado' && matricula.matricula === license,
      );
  
      if (!validMatricula) {
        throw new ErrorManager(
          `No valid license (${license}) found for this professional in SISA`,
          400,
        );
      }

      let office: Location | null = null;
      if (officeId) {
        office = await this.officeRepository.findOne({ where: { id: officeId } });
        if (!office) {
          throw new ErrorManager(`Office with ID ${officeId} not found`, 400);
        }
      }
  
      const hashedPassword = password ? await bcrypt.hash(password, 10) : null;
  
      const practitioner = this.repository.create({
        ...userData,
        dni,
        password: hashedPassword,
        role: Role.SPECIALIST,
        license,
        email,
        username,
        office,
      });
  
      const savedPractitioner = await this.repository.save(practitioner);

      const tokens = await this.authService.generateRefreshToken(savedPractitioner);

      const practitionerDto = plainToInstance(SerializerPractitionerDto, savedPractitioner);

      return { ...practitionerDto, ...tokens };
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }  

  // Obtener todos los especialistas
  async getAll(): Promise<Practitioner[]> {
    try {
      return await this.repository.find({ where: { deletedAt: null } });
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  // Obtener un especialista por ID
  async getOne(id: string): Promise<Practitioner> {
    try {
      const practitioner = await this.repository.findOne({
        where: { id },
        relations: ['specialities', 'degree'],
      });

      if (!practitioner) {
        throw new NotFoundException(`Specialist with ID ${id} not found`);
      }

      return practitioner;
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

   // Actualizar un especialista
   async update(id: string, updateSpecialistDto: UpdatePractitionerDto): Promise<Practitioner> {
    try {
      const practitioner = await this.getOne(id);

      const { specialities, degreeId, ...updatedData } = updateSpecialistDto;

      if (specialities) {
        const specialityEntities = await this.specialityRepository.findByIds(
          specialities.map((s) => s.id),
        );
        if (specialityEntities.length !== specialities.length) {
          throw new ErrorManager('Some specialities not found', 400);
        }
        practitioner.specialities = specialityEntities;
      }

      if (degreeId) {
        const degreeEntity = await this.degreeRepository.findOne({ where: { id: degreeId } });
        if (!degreeEntity) {
          throw new ErrorManager(`Degree with id "${degreeId}" not found`, 400);
        }
        practitioner.degree = degreeEntity;
      }

      Object.assign(practitioner, updatedData);
      return await this.repository.save(practitioner);
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  // Eliminar especialista (soft delete)
  async softDelete(id: string): Promise<{ message: string }> {
    try {
      const practitioner = await this.getOne(id);

      await this.repository.softRemove(practitioner);

      return { message: 'Specialist soft deleted successfully' };
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }


  // Recuperar un especialista eliminado
  async recover(id: string): Promise<{ message: string }> {
    try {
      const practitioner = await this.repository.findOne({
        where: { id },
        withDeleted: true,
      });

      if (!practitioner || !practitioner.deletedAt) {
        throw new NotFoundException(`Specialist with ID ${id} not found or not deleted`);
      }

      await this.repository.recover(practitioner);

      return { message: 'Specialist recovered successfully' };
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  //condiciones que se agregarán al query builder para filtrar los patient turn
  private practitionerConditions: Conditions<Practitioner> = {
    name: (queryBuilder: SelectQueryBuilder<Practitioner>, value: string) =>
      queryBuilder.andWhere('person.name LIKE :name', { name: `%${value}%` }),
    lastName: (queryBuilder: SelectQueryBuilder<Practitioner>, value: string) =>
      queryBuilder.andWhere('person.last_name LIKE :lastName', {
        lastName: `%${value}%`
      }),
    dni: (queryBuilder: SelectQueryBuilder<Practitioner>, value: string) =>
      queryBuilder.andWhere('person.dni LIKE :dni', { dni: `%${value}%` }),
    gender: (queryBuilder: SelectQueryBuilder<Practitioner>, value: Gender) =>
      queryBuilder.andWhere('person.gender = :gender', { gender: value }),
    birth: (queryBuilder: SelectQueryBuilder<Practitioner>, value: Date) =>
      queryBuilder.andWhere(
        '( YEAR(person.birth) = YEAR(:birth) ' +
          'AND MONTH(person.birth) = MONTH(:birth) ' +
          'AND DAY(person.birth) = DAY(:birth) ) ',
        { birth: value }
      ),
    homeService: (
      queryBuilder: SelectQueryBuilder<Practitioner>,
      value: boolean
    ) =>
      queryBuilder.andWhere('practitioner.home_service = :homeservice', {
        homeservice: value
      }),
    license: (queryBuilder: SelectQueryBuilder<Practitioner>, value: string) =>
      queryBuilder.andWhere('practitioner.license = :license', {
        license: value
      }),
    speciality: (queryBuilder: SelectQueryBuilder<Practitioner>, value: string) =>
      queryBuilder.andWhere('speciality.id = :id', { id: value }),
    socialWorkId: (
      queryBuilder: SelectQueryBuilder<Practitioner>,
      value: string
    ) => queryBuilder.andWhere('social_work.id = :id', { id: value }),
    degree: (queryBuilder: SelectQueryBuilder<Practitioner>, value: string) =>
      queryBuilder.andWhere('degree.id = :id', { id: value })
  };

  //Override del método base findAll para filtrar por propiedades
  async findAll(
    paginationDto: PractitionerFilteredPaginationDto
  ): Promise<{ data: Practitioner[]; meta: PaginationMetadata }> {
    try {
      const { page, limit } = paginationDto;
      //crea un query builder base para traer la entidad con las relaciones que necesita el Serializer
      const queryBuilderBase = this.repository
        .createQueryBuilder('practitioner')
        .leftJoinAndSelect('practitioner.person', 'person')
        .leftJoinAndSelect(
          'practitioner.specialistAttentionHour',
          'specialistAttentionHour'
        )
        .leftJoinAndSelect('practitioner.degree', 'degree')
        .leftJoinAndSelect('practitioner.speciality', 'speciality')
        .leftJoinAndSelect('practitioner.acceptedSocialWorks', 'social_work');

      //añade las condiciones where al query builder
      const query = DynamicQueryBuilder.buildSelectQuery<Practitioner>(
        queryBuilderBase,
        this.practitionerConditions,
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
            .update(Appointment)
            .set({ practitioner: null })
            .where('specialist_id = :id', { id: entity.id })
            .execute();
          await manager //eliminar el especialista de prescripcion
            .createQueryBuilder()
            .update(Prescription)
            .set({ practitioner: null })
            .where('specialist_id = :id', { id: entity.id })
            .execute();
          await manager.delete(PractitionerAppointment, { practitioner: entity });
          await manager.delete(ChargeItem, { practitioner: entity });
          await manager.remove(Practitioner, entity);
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
          await manager.softDelete(ChargeItem, { practitioner: entity });
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

  override async restore(id: string): Promise<Practitioner> {
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
          await manager.restore(ChargeItem, { practitioner: entity });
          return recovered;
        }
      );
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async findAllWithTurns(): Promise<Practitioner[]> {
    try {
      return await this.repository
        .createQueryBuilder('practitioner')
        .leftJoinAndSelect('practitioner.person', 'person')
        .leftJoinAndSelect('practitioner.specialistAttentionHour', 'specialistAttentionHour')
        .leftJoinAndSelect('practitioner.degree', 'degree')
        .leftJoinAndSelect('practitioner.speciality', 'speciality')
        .leftJoinAndSelect('practitioner.acceptedSocialWorks', 'social_work')
        .leftJoinAndSelect('practitioner.turns', 'turn')
        //.leftJoinAndSelect('turn.Patient', 'Patient') // Opcional: otras relaciones de Turn
        .getMany();
    } catch (error) {
      console.error('Error fetching specialists with turns:', error);
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  // async findTurnsBySpecialistId(specialistId: string): Promise<Turn[]> {
  //   try {
  //     const practitioner = await this.repository
  //       .createQueryBuilder('practitioner')
  //       .leftJoinAndSelect('practitioner.turns', 'turn')
  //       .leftJoinAndSelect('turn.Patient', 'Patient')
  //       .where('practitioner.id = :id', { id: specialistId })
  //       .getOne();
  
  //     if (!practitioner) {
  //       throw new ErrorManager.createSignatureError(
  //         `Specialist with id ${specialistId} not found`
  //       );
  //     }
  
  //     return practitioner.turns;
  //   } catch (error) {
  //     throw ErrorManager.createSignatureError((error as Error).message);
  //   }
  // }
  
}
