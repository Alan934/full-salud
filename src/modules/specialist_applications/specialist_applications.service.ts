import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../../common/bases/base.service';
import {
  ChangeStatusApplicationDto,
  CreateSpecialistApplicationDto,
  UpdateSpecialistApplicationDto
} from '../../domain/dtos';
import { Practitioner, SpecialistApplication } from '../../domain/entities';
import { Repository } from 'typeorm';
import { UserApplicationsService } from '../user_applications/user_applications.service';
import { ErrorManager } from '../../common/exceptions/error.manager';
import { ApplicationStatus, Role } from '../../domain/enums';
import { generatedRandomPassword } from '../../common/util/random-password.util';
import { PractitionerService } from '../practitioner/Practitioner.service';
import { PractitionerRoleService } from '../practitioner-role/PractitionerRole.service';
import { DegreesService } from '../degrees/degrees.service';

@Injectable()
export class SpecialistApplicationsService extends BaseService<
  SpecialistApplication,
  CreateSpecialistApplicationDto,
  UpdateSpecialistApplicationDto
> {
  constructor(
    @InjectRepository(SpecialistApplication)
    protected repository: Repository<SpecialistApplication>,
    private readonly userApplicationService: UserApplicationsService,
    private readonly specialistsService: PractitionerService,
    private readonly specialitiesService: PractitionerRoleService,
    private readonly degreesService: DegreesService
  ) {
    super(repository);
  }

  // Override del método create genérico
  override async create(
    createDto: CreateSpecialistApplicationDto
  ): Promise<SpecialistApplication> {
    try {
      // // Comprobar que no haya un usuario registrado con el mismo número
      // const phones = await this.authService.findAll({
      //   phone: createDto.userApplication.phone,
      //   page: 1,
      //   limit: 10
      // });

      // if (phones.data.length > 0) {
      //   throw new ErrorManager(
      //     'A user with this phone number already exists.',
      //     409
      //   );
      // }

      // Comprobar que no haya un usuario registrado con el mismo email
      // const emails = await this.authService.findAll({
      //   email: createDto.userApplication.email,
      //   page: 1,
      //   limit: 10
      // });

      // if (emails.data.length > 0) {
      //   throw new ErrorManager(
      //     'A user with this email address already exists.',
      //     409
      //   );
      // }

      // Comprobar que no haya una persona registrada con el mismo dni
      const dni = await this.specialistsService.findAll({
        dni: createDto.dni,
        page: 1,
        limit: 10
      });
      if (dni.data.length > 0) {
        throw new ErrorManager('A person with this dni already exists.', 409);
      }

      // Comprobar que no haya un especialista registrado con la misma matrícula
      const licence = await this.specialistsService.findAll({
        license: createDto.license,
        page: 1,
        limit: 10
      });
      if (licence.data.length > 0) {
        throw new ErrorManager(
          'A specialist with this license already exists.',
          409
        );
      }

      // Validar que degree existe
      try {
        await this.degreesService.findOne(createDto.degreeId);
      } catch (error) {
        throw new ErrorManager(
          `Degree with id ${createDto.degreeId} not found - ${(error as Error).message ?? 'Unknown error'}`,
          404
        );
      }

      // Validar que speciality existe
      try {
        await this.specialitiesService.findOne(createDto.specialityId);
      } catch (error) {
        throw new ErrorManager(
          `Speciality with id ${createDto.specialityId} not found - ${(error as Error).message ?? 'Unknown error'}`,
          404
        );
      }

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
          const specialistApplication =
            await transactionalEntityManager.findOne(SpecialistApplication, {
              where: { id }
            }); // Obtiene la entidad specialist application por el id

          if (!specialistApplication) {
            throw new ErrorManager(
              `Specialist Application with id ${id} not found`,
              404
            );
          }

          // Elimina lógicamente al User Applicacion relacionado con el Specialist Application
          await this.userApplicationService.softRemoveWithManager(
            specialistApplication.userApplication.id,
            transactionalEntityManager
          ),
            // Elimina lógicamente el specialist application
            await transactionalEntityManager.softRemove(
              SpecialistApplication,
              specialistApplication
            );

          return `Specialist Application with id ${id} soft deleted`;
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
          const specialistApplication =
            await transactionalEntityManager.findOne(SpecialistApplication, {
              where: { id }
            }); // Obtiene la entidad specialist application por el id

          if (!specialistApplication) {
            throw new ErrorManager(
              `Specialist Application with id ${id} not found`,
              404
            );
          }

          // Elimina al User Applicacion relacionado con el Specialist Application
          await this.userApplicationService.removeWithManager(
            specialistApplication.userApplication.id,
            transactionalEntityManager
          ),
            // Elimina el specialist application
            await transactionalEntityManager.remove(
              SpecialistApplication,
              specialistApplication
            );

          return `Specialist Application with id ${id} deleted`;
        }
      );
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  // Override del método restore genérico
  override async restore(id: string): Promise<SpecialistApplication> {
    try {
      return await this.repository.manager.transaction(
        async (transactionalEntityManager) => {
          const specialistApplication =
            await transactionalEntityManager.findOne(SpecialistApplication, {
              where: { id },
              withDeleted: true
            }); // Obtiene la entidad specialist application por el id

          if (!specialistApplication) {
            throw new ErrorManager(
              `Specialist Application with id ${id} not found`,
              404
            );
          }

          // Restaura al User Applicacion relacionado con el Specialist Application
          await this.userApplicationService.restoreWithManager(
            specialistApplication.userApplication.id,
            transactionalEntityManager
          );

          // Restaura el specialist application
          return await transactionalEntityManager.recover(
            SpecialistApplication,
            specialistApplication
          );
        }
      );
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  //Verificar que hacer con esto despues

  // async changeStatus(
  //   id: string,
  //   changeStatusApplicationDto: ChangeStatusApplicationDto
  // ): Promise<SpecialistApplication | Specialist> {
  //   try {
  //     const specialistApplication = await this.findOne(id);

  //     const { status } = changeStatusApplicationDto;

  //     const applicationStatus =
  //       specialistApplication.userApplication.applicationStatus;

  //     // Verifica si el estado ya es el mismo, si es así, no se hacen cambios
  //     if (applicationStatus === status) {
  //       return specialistApplication;
  //     }

  //     return await this.repository.manager.transaction(
  //       async (transactionalEntityManager) => {
  //         // Si se aprueba la solicitud, se crea el usuario y se elimina la solicitud
  //         if (status === ApplicationStatus.APPROVED) {
  //           // Desestructuración para obtener los valores
  //           const {
  //             degreeId,
  //             specialityId,
  //             license,
  //             userApplication: { phone, email },
  //             name,
  //             lastName,
  //             dni,
  //             gender,
  //             birth,
  //             documentType
  //           } = specialistApplication;
  //           const password = generatedRandomPassword(specialistApplication);

  //           // Crear usuario
  //           const user = await this.authService.create({
  //             role: Role.SPECIALIST,
  //             email,
  //             username: `${Role.SPECIALIST.toLowerCase()}_${Date.now()}`,
  //             password
  //           });

  //           // Crear especialista
  //           const specialist = this.specialistsService.create({
  //             license,
  //             degree: { id: degreeId },
  //             speciality: { id: specialityId, },
  //             person: { name, lastName, dni, gender, documentType, birth, user }
  //           });

  //           // Eliminar solicitud
  //           this.remove(specialistApplication.id);

  //           // Enviar email AcceptedApplication
  //           /*emailer.sendAcceptedApplicationMail(
  //             applicantName: specialistApplication.name+" "+specialistApplication.lastName, 
  //             user: user, 
  //             password: password
  //           );
  //           */

  //           return specialist;
  //         } else if (status === ApplicationStatus.REJECTED) {
  //           // Obtener la razón por la que se rechazó la solicitud
  //           //const { reason } = changeStatusApplicationDto;
  //           // Si se rechaza la solicitud, enviar un mail RejectedApplication
  //           /*emailer.sendRejectedApplicationMail(
  //             applicantName: specialistApplication.name+" "+specialistApplication.lastName, 
  //             reason: reason, 
  //             applicantMail: specialistApplication.email,
  //           );*/
  //         }

  //         // Asigna el nuevo status
  //         specialistApplication.userApplication.applicationStatus = status;

  //         return await transactionalEntityManager.save(specialistApplication);
  //       }
  //     );
  //   } catch (error) {
  //     throw ErrorManager.createSignatureError((error as Error).message);
  //   }
  // }
}
