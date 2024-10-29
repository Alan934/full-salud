import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/bases/base.service';
import {
  ChangeStatusApplicationDto,
  CreateInstitutionApplicationDto,
  UpdateInstitutionApplicationDto
} from 'src/domain/dtos';
import { Headquarters, InstitutionApplication } from 'src/domain/entities';
import { Repository } from 'typeorm';
import { UserApplicationsService } from '../user_applications/user_applications.service';
import { ErrorManager } from 'src/common/exceptions/error.manager';
import { ApplicationStatus, Role } from 'src/domain/enums';
import { AuthService } from '../auth/auth.service';
import { generatedRandomPassword } from 'src/common/util/random-password.util';
import { InstitutionsService } from '../institutions/institutions.service';
import { InstitutionTypesService } from '../institution_types/institution_types.service';
import { HeadquartersService } from '../headquarters/headquarters.service';

@Injectable()
export class InstitutionApplicationsService extends BaseService<
  InstitutionApplication,
  CreateInstitutionApplicationDto,
  UpdateInstitutionApplicationDto
> {
  constructor(
    @InjectRepository(InstitutionApplication)
    protected repository: Repository<InstitutionApplication>,
    private readonly userApplicationService: UserApplicationsService,
    private readonly authService: AuthService,
    private readonly institutionTypesService: InstitutionTypesService,
    private readonly institutionsService: InstitutionsService,
    private readonly headquartersService: HeadquartersService
  ) {
    super(repository);
  }

  // Override del método create genérico
  override async create(
    createDto: CreateInstitutionApplicationDto
  ): Promise<InstitutionApplication> {
    try {
      // Comprobar que no haya un usuario registrado con el mismo número
      const phones = await this.authService.findAll({
        phone: createDto.userApplication.phone,
        page: 1,
        limit: 10
      });

      if (phones.data.length > 0) {
        throw new ErrorManager(
          'A user with this phone number already exists.',
          409
        );
      }

      // Comprobar que no haya un usuario registrado con el mismo email
      const emails = await this.authService.findAll({
        email: createDto.userApplication.email,
        page: 1,
        limit: 10
      });

      if (emails.data.length > 0) {
        throw new ErrorManager(
          'A user with this email address already exists.',
          409
        );
      }

      // Comprobar que el id de institution types corresponde a un registro existente
      await this.institutionTypesService.findOne(createDto.institutionTypeId);

      // Crear solicitud
      return await this.repository.save(createDto);
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  // Override del método softRemove genérico
  override async softRemove(id: string): Promise<string> {
    try {
      return await this.repository.manager.transaction(
        async (transactionalEntityManager) => {
          const institutionApplication =
            await transactionalEntityManager.findOne(InstitutionApplication, {
              where: { id }
            }); // Obtiene la entidad institution application por el id

          if (!institutionApplication) {
            throw new ErrorManager(
              `Institution Application with id ${id} not found`,
              404
            );
          }

          // Elimina lógicamente al User Applicacion relacionado con Institution Application
          await this.userApplicationService.softRemoveWithManager(
            institutionApplication.userApplication.id,
            transactionalEntityManager
          ),
            // Elimina lógicamente a institution application
            await transactionalEntityManager.softRemove(
              InstitutionApplication,
              institutionApplication
            );

          return `Institution Application with id ${id} soft deleted`;
        }
      );
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  // Override del método remove genérico
  override async remove(id: string): Promise<string> {
    try {
      return await this.repository.manager.transaction(
        async (transactionalEntityManager) => {
          const institutionApplication =
            await transactionalEntityManager.findOne(InstitutionApplication, {
              where: { id }
            }); // Obtiene la entidad institution application por el id

          if (!institutionApplication) {
            throw new ErrorManager(
              `Institution Application with id ${id} not found`,
              404
            );
          }

          // Elimina al User Applicacion relacionado con Institution Application
          await this.userApplicationService.removeWithManager(
            institutionApplication.userApplication.id,
            transactionalEntityManager
          ),
            // Elimina a institution application
            await transactionalEntityManager.remove(
              InstitutionApplication,
              institutionApplication
            );

          return `Institution Application with id ${id} deleted`;
        }
      );
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  // Override del método restore genérico
  override async restore(id: string): Promise<InstitutionApplication> {
    try {
      return await this.repository.manager.transaction(
        async (transactionalEntityManager) => {
          const institutionApplication =
            await transactionalEntityManager.findOne(InstitutionApplication, {
              where: { id },
              withDeleted: true
            }); // Obtiene la entidad institution application por el id

          if (!institutionApplication) {
            throw new ErrorManager(
              `Institution Application with id ${id} not found`,
              404
            );
          }

          // Restaura al User Applicacion relacionado con Institution Application
          await this.userApplicationService.restoreWithManager(
            institutionApplication.userApplication.id,
            transactionalEntityManager
          );

          // Restaura a institution application
          return await transactionalEntityManager.recover(
            InstitutionApplication,
            institutionApplication
          );
        }
      );
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async changeStatus(
    id: string,
    changeStatusApplicationDto: ChangeStatusApplicationDto
  ): Promise<InstitutionApplication | Headquarters> {
    try {
      const institutionApplication = await this.findOne(id);

      const { status } = changeStatusApplicationDto;

      const applicationStatus =
        institutionApplication.userApplication.applicationStatus;

      // Verifica si el estado ya es el mismo, si es así, no se hacen cambios
      if (applicationStatus === status) {
        return institutionApplication;
      }

      return await this.repository.manager.transaction(
        async (transactionalEntityManager) => {
          // Si se aprueba la solicitud, se crea el usuario y se elimina la solicitud
          if (status === ApplicationStatus.APPROVED) {
            // Desestructuración para obtener los valores
            const {
              institutionTypeId,
              cuit,
              businessName,
              userApplication: { phone, email }
            } = institutionApplication;
            const password = await generatedRandomPassword(
              institutionApplication
            );

            const role = Role.INSTITUTION;

            // Crear usuario
            const user = await this.authService.create({
              role,
              phone,
              email,
              username: `${role.toLowerCase()}_${Date.now()}`,
              password
            });

            // Obtener institution type
            const institutionType =
              await this.institutionTypesService.findOne(institutionTypeId);

            // Crear institución
            const institution = await this.institutionsService.create({
              cuit,
              businessName,
              institutionType,
              commissions: null
            });

            // Crear sede cental
            const headquarters = await this.headquartersService.create({
              cuit,
              businessName,
              phone,
              user,
              institution,
              address: null,
              isMainBranch: true
            });

            // Eliminar solicitud
            this.remove(institutionApplication.id);

            // Enviar email diciendo que el usuario ha sido creado e informar la clave autogenerada. En el mail,recomendar que cambien la clave

            return headquarters;
          } else if (status === ApplicationStatus.REJECTED) {
            // Obtener la razón por la que se rechazó la solicitud
            // const { reason } = changeStatusApplicationDto;
            // Si se rechaza la solicitud, enviar un mail informando sobre el rechazo.
          }

          // Asigna el nuevo status
          institutionApplication.userApplication.applicationStatus = status;

          return await transactionalEntityManager.save(institutionApplication);
        }
      );
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }
}
