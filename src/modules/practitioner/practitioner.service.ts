import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../../common/bases/base.service';
import * as xml2js from 'xml2js';
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
  Location,
  SocialWork
} from '../../domain/entities';
import { EntityManager, Not, Repository, SelectQueryBuilder } from 'typeorm';
import { Gender, Role } from '../../domain/enums';
import * as bcrypt from 'bcrypt';
import axios from 'axios';
import { CreatePractitionerDto, PractitionerByNameAndLicenseDto, UpdatePractitionerDto } from '../../domain/dtos/practitioner/practitioner.dto';
import { PractitionerFilteredPaginationDto } from '../../domain/dtos/practitioner/practitioner-filtered-pagination.dto';
import { AuthService } from '../auth/auth.service';
import { plainToInstance } from 'class-transformer';
import { SerializerPractitionerDto } from '../../domain/dtos';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { PractitionerSocialWork } from '../../domain/entities/practitioner-social-work.entity';

@Injectable()
export class PractitionerService {
  constructor(
    @InjectRepository(Practitioner) protected repository: Repository<Practitioner>,
    @InjectRepository(PractitionerRole) private readonly practitionerRoleRepository: Repository<PractitionerRole>,
    @InjectRepository(Patient) private readonly patientRepository: Repository<Patient>,
    @InjectRepository(ProfessionalDegree) private readonly professionalDegreeRepository: Repository<ProfessionalDegree>,
    @InjectRepository(PractitionerSocialWork) private readonly practitionerSocialWorkRepository: Repository<PractitionerSocialWork>, // Repositorio para la entidad intermedia
    @Inject(forwardRef(() => AuthService)) private readonly authService: AuthService,
    private readonly httpService: HttpService,
    private readonly entityManager: EntityManager,
  ) {
  }

  // Crear un nuevo especialista
  async createSpecialist(createSpecialistDto: CreatePractitionerDto) {
    return this.entityManager.transaction(async manager => {
      try {
        const { password, dni, license, email, username, socialWorkDetails, ...userData } = createSpecialistDto;
  
        const practitionerRepository = manager.getRepository(Practitioner);
        const patientRepository = manager.getRepository(Patient);
        const practitionerSocialWorkRepository = manager.getRepository(PractitionerSocialWork);
        const socialWorkRepository = manager.getRepository(SocialWork);

        // Validar existencia previa (dni, email, username, phone)
        const orConditions = [];
        if (dni) orConditions.push({ dni });
        if (email) orConditions.push({ email });

        if (orConditions.length > 0) {
            const existingPractitioner = await practitionerRepository.findOne({ where: orConditions });
            if (existingPractitioner) {
                 throw new ErrorManager('Practitioner with provided DNI or email already exists', 400);
            }
        }
        
        const patientOrConditions = [];
        if (email) patientOrConditions.push({ email });
        if (dni) patientOrConditions.push({ dni });

        if (patientOrConditions.length > 0) {
            const existingPatient = await patientRepository.findOne({ where: patientOrConditions });
             if (existingPatient) {
                throw new ErrorManager('A patient already exists with the provided email or dni', 400);
            }
        }
  
        if (dni && license) { // SISA validation only if DNI and license are provided
          await this.validatePractitionerInSisa(dni, license);
        }
  
        const hashedPassword = password ? await bcrypt.hash(password, 10) : null;
  
        const practitioner = practitionerRepository.create({
          ...userData,
          dni,
          password: hashedPassword,
          role: Role.PRACTITIONER,
          license,
          email,
          username,
        });
  
        const savedPractitioner = await practitionerRepository.save(practitioner);
  
        // Manejar PractitionerSocialWorks
        if (socialWorkDetails && socialWorkDetails.length > 0) {
          for (const detail of socialWorkDetails) {
            const socialWorkExists = await socialWorkRepository.findOneBy({ id: detail.socialWorkId });
            if (!socialWorkExists) {
              throw new ErrorManager(`SocialWork with ID ${detail.socialWorkId} not found.`, 400);
            }
            const newPsw = practitionerSocialWorkRepository.create({
              practitioner: savedPractitioner, // o practitionerId: savedPractitioner.id
              socialWork: socialWorkExists, // o socialWorkId: detail.socialWorkId
              price: detail.price,
            });
            await practitionerSocialWorkRepository.save(newPsw);
          }
        }
  
        const payload: JwtPayload = { 
          id: savedPractitioner.id, 
          email: savedPractitioner.email, 
          role: savedPractitioner.role, 
          name: savedPractitioner.name, 
          lastName: savedPractitioner.lastName 
        };
        const token = await this.authService.signJWT(payload);
        const fullPractitioner = await practitionerRepository.findOne({
            where: { id: savedPractitioner.id },
            relations: [
                'professionalDegree', 
                'practitionerRole', 
                'socialWorkEnrollment', 
                'socialWorkEnrollment.socialWork', 
                'practitionerSocialWorks',
                'practitionerSocialWorks.socialWork'
            ]
        });

        const practitionerDto = plainToInstance(SerializerPractitionerDto, fullPractitioner);
        return { ...practitionerDto, accessToken: token };

      } catch (error) {
        if (error instanceof ErrorManager) throw error;
        throw ErrorManager.createSignatureError((error as Error).message);
      }
    });
  }

async validatePractitionerInSisa(dni: string, license: string): Promise<boolean> {
  try {
    const sisaUrl = `https://sisa.msal.gov.ar/sisa/services/rest/profesional/obtener?nrodoc=${dni}&usuario=jlllado&clave=$FullSalud123`;
    
    console.log(`[SISA Validation] Querying URL: ${sisaUrl}`);
    const response = await firstValueFrom(this.httpService.get(sisaUrl, {
      responseType: 'text' 
    }));

    const xmlDataString = response.data;

    console.log('[SISA Validation] Raw XML response type:', typeof xmlDataString);

    let profesionalData: any;

    if (typeof xmlDataString === 'string' && xmlDataString.trim().startsWith('<')) {
      // Es XML
      const parser = new xml2js.Parser({ 
        explicitArray: false,
        trim: true,
        ignoreAttrs: true
      });
      const parsedResult = await parser.parseStringPromise(xmlDataString);
      profesionalData = parsedResult.Profesional;
    } else {
      // Es JSON
      try {
        profesionalData = JSON.parse(xmlDataString);
      } catch (e) {
        console.error('[SISA Validation] SISA response is not valid JSON or XML:', xmlDataString);
        throw new ErrorManager('SISA did not return valid XML or JSON. Response: ' + xmlDataString, 502);
      }
    }

    if (!profesionalData) {
        console.error('[SISA Validation] Could not find <Profesional> node in parsed XML or JSON:', JSON.stringify(profesionalData, null, 2));
        throw new ErrorManager('Failed to parse SISA response: <Profesional> node missing.', 500);
    }
    
    if (profesionalData.resultado !== 'OK') {
        const errorMessage = profesionalData.descripcion || 'Professional not found or error querying SISA API.';
        throw new ErrorManager(errorMessage, 400);
    }

    // Si el resultado es OK, continuar con las validaciones
    if (profesionalData.numeroDocumento !== dni) {
      throw new ErrorManager('DNI does not match SISA records.', 400);
    }

    let matriculasArray: any[] = [];
    if (Array.isArray(profesionalData.matriculas)) {
      // JSON: array directo
      matriculasArray = profesionalData.matriculas;
    } else if (profesionalData.matriculas && profesionalData.matriculas.matricula) {
      // XML parseado: puede ser array u objeto
      if (Array.isArray(profesionalData.matriculas.matricula)) {
        matriculasArray = profesionalData.matriculas.matricula;
      } else {
        matriculasArray = [profesionalData.matriculas.matricula];
      }
    }
    
    const validMatricula = matriculasArray.find(
      (m: any) => {
        const sisaLicense = String(m.matricula).trim();
        const sisaEstado = String(m.estado).trim();
        const providedLicense = String(license).trim();

        return sisaEstado === 'Habilitado' && sisaLicense === providedLicense;
      }
    );

    if (!validMatricula) {
      throw new ErrorManager(
        `No valid and enabled license (${license}) found for this professional in SISA. Processed ${matriculasArray.length} matricula(s).`,
        400,
      );
    }
    
    return true;

  } catch (error) {
    if (error instanceof ErrorManager) {
      throw error;
    }
    if (axios.isAxiosError(error)) {
      // Error de red o HTTP al contactar SISA
      throw new ErrorManager(
        `SISA validation service communication error: ${error.message}`, 
        error.response?.status || 503
      );
    }
    throw ErrorManager.createSignatureError((error as Error).message || 'An unexpected error occurred during SISA validation.');
  }
}

  // Obtener todos los especialistas
  async getAll(): Promise<Practitioner[]> {
    try {
      return await this.repository.find({ 
        where: { deletedAt: null },
        relations: [
            'professionalDegree', 
            'practitionerRole', 
            'socialWorkEnrollment', 
            'socialWorkEnrollment.socialWork', 
            'practitionerSocialWorks',
            'practitionerSocialWorks.socialWork'
        ]
      });
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  // Obtener un especialista por ID
  async getOne(id: string): Promise<Practitioner> {
    try {
      const practitioner = await this.repository.findOne({
        where: { id },
        relations: [
          'practitionerRole', 
          'professionalDegree', 
          'socialWorkEnrollment', 
          'socialWorkEnrollment.socialWork',
          'practitionerSocialWorks',
          'practitionerSocialWorks.socialWork'
        ],
      });

      if (!practitioner) {
        throw new NotFoundException(`Specialist with ID ${id} not found`);
      }
      return practitioner;
    } catch (error) {
      if (error instanceof ErrorManager) throw error;
      if (error instanceof NotFoundException) throw error;
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async findByNameAndLicense(filterDto: PractitionerByNameAndLicenseDto): Promise<Practitioner> {
    try {
      const queryBuilder = this.repository.createQueryBuilder('practitioner')
        .leftJoinAndSelect('practitioner.practitionerRole', 'practitionerRole')
        .leftJoinAndSelect('practitioner.professionalDegree', 'professionalDegree')
        .leftJoinAndSelect('practitioner.socialWorkEnrollment', 'socialWorkEnrollment')
        .leftJoinAndSelect('socialWorkEnrollment.socialWork', 'socialWorkRel') // Renombrar alias para evitar colisión
        .leftJoinAndSelect('practitioner.practitionerSocialWorks', 'practitionerSocialWorksRel')
        .leftJoinAndSelect('practitionerSocialWorksRel.socialWork', 'swDetails')
        .where('practitioner.deletedAt IS NULL');
        
      const { name, license } = filterDto;
      if (!name && !license) {
        throw new ErrorManager('At least one filter parameter (name or license) is required', 400);
      }
      if (name && license) {
        queryBuilder.andWhere('(practitioner.name LIKE :name OR practitioner.lastName LIKE :name) AND practitioner.license = :license', { name: `%${name}%`, license });
      } else if (name) {
        queryBuilder.andWhere('practitioner.name LIKE :name OR practitioner.lastName LIKE :name', { name: `%${name}%` });
      } else if (license) {
        queryBuilder.andWhere('practitioner.license = :license', { license });
      }
      const practitioner = await queryBuilder.getOne();
      if (!practitioner) {
        throw new NotFoundException('No practitioner found with the provided filters');
      }
      return practitioner;

    } catch (error) {
        if (error instanceof ErrorManager) throw error;
        if (error instanceof NotFoundException) throw error;
        throw ErrorManager.createSignatureError((error as Error).message);
    }
  }


   // Actualizar un especialista
  async update(id: string, updateSpecialistDto: UpdatePractitionerDto): Promise<Practitioner> {
    return this.entityManager.transaction(async manager => {
      try {
        const practitionerRepository = manager.getRepository(Practitioner);
        const practitionerSocialWorkRepository = manager.getRepository(PractitionerSocialWork);
        const socialWorkRepository = manager.getRepository(SocialWork);
        
        // Usar el this.getOne para asegurar que las relaciones base se cargan
        // pero luego trabajar con la instancia obtenida por el manager para la transacción
        const practitionerToUpdate = await practitionerRepository.findOne({
            where: {id},
            relations: ['practitionerSocialWorks'] // Cargar las obras sociales actuales para comparar
        });

        if (!practitionerToUpdate) {
            throw new NotFoundException(`Specialist with ID ${id} not found`);
        }
  
        const { practitionerRole, professionalDegreeId, socialWorkDetails, ...updatedUserFields } = updateSpecialistDto;
        
        // Validar que campos únicos como email, dni, username no colisionen con otros usuarios
        const uniqueChecks: ({ [key: string]: any; id?: any })[] = [];
        if (updatedUserFields.email) uniqueChecks.push({ email: updatedUserFields.email, id: Not(id) });
        if (updatedUserFields.dni) uniqueChecks.push({ dni: updatedUserFields.dni, id: Not(id) });
        if (updatedUserFields.username) uniqueChecks.push({ username: updatedUserFields.username, id: Not(id) });
        if (updatedUserFields.phone) uniqueChecks.push({ phone: updatedUserFields.phone, id: Not(id) });

        if (uniqueChecks.length > 0) {
            const existingPractitioner = await practitionerRepository.findOne({ where: uniqueChecks });
            if (existingPractitioner) {
                throw new ErrorManager('Another practitioner already exists with the provided DNI, email, username, or phone.', 400);
            }
            // También verificar contra pacientes para email y username
            const patientChecks = [];
            if (updatedUserFields.email) patientChecks.push({ email: updatedUserFields.email });
            if (updatedUserFields.username) patientChecks.push({ username: updatedUserFields.username });
            if (patientChecks.length > 0) {
                const existingPatient = await manager.getRepository(Patient).findOne({where: patientChecks});
                if(existingPatient) {
                    throw new ErrorManager('A patient already exists with the provided email or username.', 400);
                }
            }
        }
        
        // Actualizar campos directos de Practitioner (User)
        practitionerRepository.merge(practitionerToUpdate, updatedUserFields);
  
        if (practitionerRole) {
            const practitionerRoleEntities = await manager.getRepository(PractitionerRole).findByIds(
                practitionerRole.map((s) => s.id),
            );
            if (practitionerRoleEntities.length !== practitionerRole.length) {
                throw new ErrorManager('Some practitionerRole not found', 400);
            }
            practitionerToUpdate.practitionerRole = practitionerRoleEntities;
        }
  
        if (professionalDegreeId) {
            const professionalDegreeEntity = await manager.getRepository(ProfessionalDegree).findOne({ where: { id: professionalDegreeId } });
            if (!professionalDegreeEntity) {
                throw new ErrorManager(`professionalDegree with id "${professionalDegreeId}" not found`, 400);
            }
            practitionerToUpdate.professionalDegree = professionalDegreeEntity;
        }
  
        // Manejar actualización de PractitionerSocialWorks
        if (socialWorkDetails) { // Si se envía socialWorkDetails (incluso vacío para borrar todo)
            // 1. Eliminar las PractitionerSocialWork existentes para este practitioner
            if (practitionerToUpdate.practitionerSocialWorks && practitionerToUpdate.practitionerSocialWorks.length > 0) {
                await practitionerSocialWorkRepository.remove(practitionerToUpdate.practitionerSocialWorks);
            }
            
            // 2. Crear las nuevas PractitionerSocialWork
            const newPswEntities: PractitionerSocialWork[] = [];
            for (const detail of socialWorkDetails) {
                const socialWorkExists = await socialWorkRepository.findOneBy({ id: detail.socialWorkId });
                if (!socialWorkExists) {
                    throw new ErrorManager(`SocialWork with ID ${detail.socialWorkId} not found.`, 400);
                }
                const newPsw = practitionerSocialWorkRepository.create({
                    practitioner: practitionerToUpdate,
                    socialWork: socialWorkExists,
                    price: detail.price,
                });
                newPswEntities.push(newPsw);
            }
            if (newPswEntities.length > 0) {
              await practitionerSocialWorkRepository.save(newPswEntities);
            }
            // La relación en practitionerToUpdate se actualizará por el save de arriba o recargando la entidad.
            // Para evitar una recarga, podemos asignarla manualmente si el save no devuelve la relación anidada actualizada.
            // practitionerToUpdate.practitionerSocialWorks = await practitionerSocialWorkRepository.find({where: {practitionerId: practitionerToUpdate.id}, relations: ['socialWork'] });
        }
  
        await practitionerRepository.save(practitionerToUpdate);

        // Recargar la entidad para devolverla completa con todas las relaciones actualizadas
        const fullPractitioner = await practitionerRepository.findOne({
            where: { id: practitionerToUpdate.id },
            relations: [
                'professionalDegree', 
                'practitionerRole', 
                'socialWorkEnrollment', 
                'socialWorkEnrollment.socialWork', 
                'practitionerSocialWorks',
                'practitionerSocialWorks.socialWork'
            ]
        });
        return fullPractitioner!; // Non-null assertion, ya que acabamos de guardarlo.

      } catch (error) {
        if (error instanceof ErrorManager) throw error;
        if (error instanceof NotFoundException) throw error;
        throw ErrorManager.createSignatureError((error as Error).message);
      }
    });
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
      queryBuilder.andWhere('user.name LIKE :name', { name: `%${value}%` }),
    lastName: (queryBuilder: SelectQueryBuilder<Practitioner>, value: string) =>
      queryBuilder.andWhere('user.last_name LIKE :lastName', {
        lastName: `%${value}%`
      }),
    dni: (queryBuilder: SelectQueryBuilder<Practitioner>, value: string) =>
      queryBuilder.andWhere('user.dni LIKE :dni', { dni: `%${value}%` }),
    gender: (queryBuilder: SelectQueryBuilder<Practitioner>, value: Gender) =>
      queryBuilder.andWhere('user.gender = :gender', { gender: value }),
    birth: (queryBuilder: SelectQueryBuilder<Practitioner>, value: Date) =>
      queryBuilder.andWhere(
        '( YEAR(user.birth) = YEAR(:birth) ' +
          'AND MONTH(user.birth) = MONTH(:birth) ' +
          'AND DAY(user.birth) = DAY(:birth) ) ',
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
    practitionerRole: (queryBuilder: SelectQueryBuilder<Practitioner>, value: string) =>
      queryBuilder.andWhere('practitioner_role.id = :id', { id: value }),
    socialWorkEnrollmentId: (
      queryBuilder: SelectQueryBuilder<Practitioner>,
      value: string
    ) => queryBuilder.andWhere('social_work_enrrollment.id = :id', { id: value }),
    professionalDegree: (queryBuilder: SelectQueryBuilder<Practitioner>, value: string) =>
      queryBuilder.andWhere('professionalDegree.id = :id', { id: value })
  };

  //Override del método base findAll para filtrar por propiedades
  async findAllDeprecated(
    paginationDto: PractitionerFilteredPaginationDto
  ): Promise<{ data: Practitioner[]; meta: PaginationMetadata }> {
    try {
      const { page, limit } = paginationDto;
      //crea un query builder base para traer la entidad con las relaciones que necesita el Serializer
      const queryBuilderBase = this.repository
        .createQueryBuilder('practitioner')
        .leftJoinAndSelect(
          'practitioner.practitionerAppointment',
          'practitionerAppointment'
        )
        .leftJoinAndSelect('practitioner.professionalDegree', 'professionalDegree')
        .leftJoinAndSelect('practitioner.practitionerRole', 'practitionerRole')
        //.leftJoinAndSelect('practitioner.acceptedSocialWorks', 'social_work');

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
      return {
        data: entities,
        meta: getPagingData(entities, page, limit)
      };
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async remove(id: string): Promise<string> {
    try {
      const entity = await this.getOne(id);
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
          return `Entity with id ${id} deleted`;
        }
      );
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async softRemove(id: string): Promise<string> {
    try {
      const entity = await this.getOne(id);
      return this.repository.manager.transaction(
        async (manager: EntityManager) => {
          await manager.softDelete(ChargeItem, { practitioner: entity });
          await manager.softRemove(entity);
          return `Entity with id ${id} soft deleted`;
        }
      );
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async restore(id: string): Promise<Practitioner> {
    try {
      const entity = await this.repository.findOne({
        where: { id },
        withDeleted: true
      });
      return this.repository.manager.transaction(
        async (manager: EntityManager) => {
          const recovered = await manager.recover(entity);
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
        .leftJoinAndSelect('practitioner.practitionerAppointment', 'practitionerAppointment')
        .leftJoinAndSelect('practitioner.professionalDegree', 'professionalDegree')
        .leftJoinAndSelect('practitioner.practitionerRole', 'practitionerRole')
        //.leftJoinAndSelect('practitioner.acceptedSocialWorks', 'social_work')
        .leftJoinAndSelect('practitioner.turns', 'turn')
        //.leftJoinAndSelect('turn.Patient', 'Patient') // Opcional: otras relaciones de Turn
        .getMany();
    } catch (error) {
      console.error('Error fetching specialists with turns:', error);
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async practitionerPaginationAll(
    filteredDto: PractitionerFilteredPaginationDto,
  ): Promise<{ 
    data: Practitioner[]; 
    total: number; 
    page: number; 
    limit: number;
    lastPage: number;
    filters?: any;
  }> {
    try {
      const { page = 1, limit = 10, ...filters } = filteredDto;

      const queryBuilder = this.repository
        .createQueryBuilder('practitioner')
        .leftJoinAndSelect('practitioner.professionalDegree', 'professionalDegree')
        .leftJoinAndSelect('practitioner.practitionerRole', 'practitionerRole')
        .leftJoinAndSelect('practitioner.socialWorkEnrollment', 'socialWorkEnrollment') // Esta es la obra social principal del profesional
        // .leftJoinAndSelect('socialWorkEnrollment.socialWork', 'swEnrollmentDetail') // Detalle de la OS principal
        .leftJoinAndSelect('practitioner.practitionerAppointment', 'practitionerAppointment')
        // .leftJoinAndSelect('practitioner.favorite', 'favorite') // 'favorite' no está en Practitioner entity
        // Para las obras sociales que atiende (a través de la entidad intermedia):
        .leftJoinAndSelect('practitioner.practitionerSocialWorks', 'practitionerSocialWorksRel')
        .leftJoinAndSelect('practitionerSocialWorksRel.socialWork', 'acceptedSocialWorkDetail') // Detalle de las OS que atiende
        .where('practitioner.deletedAt IS NULL');

      // Aplicar filtros dinámicos
      // ... (filtros existentes para name, lastName, dni, gender, license, homeService, etc.)
        if (filters.name) {
         queryBuilder.andWhere('(practitioner.name LIKE :name OR practitioner.lastName LIKE :name)', { name: `%${filters.name}%` });
        }
        // ... (otros filtros como estaban) ...
        if (filters.lastName) queryBuilder.andWhere('practitioner.lastName LIKE :lastName', { lastName: `%${filters.lastName}%` });
        if (filters.dni) queryBuilder.andWhere('practitioner.dni LIKE :dni', { dni: `%${filters.dni}%` });
        if (filters.gender) queryBuilder.andWhere('practitioner.gender = :gender', { gender: filters.gender });
        if (filters.license) queryBuilder.andWhere('practitioner.license LIKE :license', { license: `%${filters.license}%` });
        if (filters.homeService !== undefined) queryBuilder.andWhere('practitioner.homeService = :homeService', { homeService: filters.homeService });
        if (filters.durationAppointment) queryBuilder.andWhere('practitioner.durationAppointment = :durationAppointment', { durationAppointment: filters.durationAppointment });
        if (filters.birth) queryBuilder.andWhere('practitioner.birth = :birth', { birth: filters.birth });
        if (filters.professionalDegree) queryBuilder.andWhere('professionalDegree.id = :professionalDegreeId', { professionalDegreeId: filters.professionalDegree });
        if (filters.practitionerRole) queryBuilder.andWhere('practitionerRole.id = :practitionerRoleId', { practitionerRoleId: filters.practitionerRole });

      // Filtro para socialWorkEnrollmentId (obra social principal del profesional)
      if (filters.socialWorkEnrollmentId) {
        queryBuilder.andWhere('socialWorkEnrollment.id = :socialWorkEnrollmentId', { 
          socialWorkEnrollmentId: filters.socialWorkEnrollmentId 
        });
      }

      // Filtro para socialWorkId (obras sociales que atiende el profesional)
      // Esto necesita que el join a practitionerSocialWorksRel y acceptedSocialWorkDetail exista
      if (filters.socialWorkId) {
        // Para asegurar que no haya duplicados si un practitioner tiene múltiples roles pero solo queremos filtrar por SW
        // y evitar problemas con el COUNT, es mejor usar un subquery o un EXISTS si el filtro es complejo
        // o simplemente un JOIN y luego un DISTINCT en el select principal si es necesario.
        // Por ahora, un andWhere simple, pero tener en cuenta la multiplicidad.
        queryBuilder.andWhere('acceptedSocialWorkDetail.id = :socialWorkId_accepted', { 
          socialWorkId_accepted: filters.socialWorkId 
        });
      }
      
      if (filters.locationName) {
        queryBuilder.andWhere('practitionerAppointment.location.name LIKE :locationName', { locationName: `%${filters.locationName}%` });
      }
      if (filters.appointmentDay) {
        queryBuilder.andWhere('practitionerAppointment.day = :appointmentDay', { appointmentDay: filters.appointmentDay });
      }
      
      queryBuilder.orderBy('practitioner.name', 'ASC');

      const [data, total] = await queryBuilder
        .skip((page - 1) * limit)
        .take(limit)
        .getManyAndCount();

      const lastPage = Math.ceil(total / limit);

      return {
        data,
        total,
        page,
        limit,
        lastPage,
        filters: Object.keys(filters).length > 0 ? filters : undefined
      };
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }
  
}
