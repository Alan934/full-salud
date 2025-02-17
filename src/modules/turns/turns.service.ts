import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../../common/bases/base.service';
import { ErrorManager } from '../../common/exceptions/error.manager';
import { CreateTurnDto, UpdateTurnDto } from '../../domain/dtos';
import { Patient, Practitioner, Turn } from '../../domain/entities';
import { TurnStatus, Role } from '../../domain/enums';
import { Express } from 'express';
import 'multer';
import { EntityManager, In, Repository } from 'typeorm';
import { DerivationImagesService } from '../derivation_images/derivation_images.service';

@Injectable()
export class TurnsService extends BaseService<
  Turn,
  CreateTurnDto,
  UpdateTurnDto
> {
  constructor(
    @InjectRepository(Turn) protected repository: Repository<Turn>,
    private readonly derivationImagesService: DerivationImagesService
  ) {
    super(repository);
  }

  async createTurn(createTurnDto: CreateTurnDto): Promise<Turn> {
    const queryRunner = this.repository.manager.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let patient: Patient;

      // Verificar si llega `patientId` o el objeto `patient`
      if (createTurnDto.patientId) {
        patient = await queryRunner.manager.findOne(Patient, {
          where: { id: createTurnDto.patientId },
        });

        if (!patient) {
          throw new NotFoundException(
            `Patient with ID ${createTurnDto.patientId} not found`
          );
        }
      } else if (createTurnDto.patient) {
        const existingPatient = await queryRunner.manager.findOne(Patient, {
          where: { dni: createTurnDto.patient.dni },
        });

        if (existingPatient) {
          patient = existingPatient;
        } else {
          patient = queryRunner.manager.create(Patient, {
            dni: createTurnDto.patient.dni,
            name: createTurnDto.patient.name,
            lastName: createTurnDto.patient.lastName,
            email: createTurnDto.patient.email,
            phone: createTurnDto.patient.phone,
            documentType: createTurnDto.patient.documentType,
            role: Role.PATIENT,
          });
          patient = await queryRunner.manager.save(patient);
        }
      } else {
        throw new BadRequestException(
          'Either patientId or patient object must be provided'
        );
      }

      const specialistIds = createTurnDto.practitionerIds.map((s) => s.id);

      // Asegurarnos de que los IDs no estén vacíos
      if (!specialistIds || specialistIds.length === 0) {
        throw new BadRequestException('At least one specialist ID must be provided');
      }

      const specialists = await queryRunner.manager.find(Practitioner, {
        where: { id: In(specialistIds) },
      });

      // Comprobamos si el número de especialistas encontrados coincide con los solicitados
      if (specialists.length !== specialistIds.length) {
        const notFoundIds = specialistIds.filter(id => !specialists.some(s => s.id === id));
        throw new NotFoundException(`Practitioner with IDs ${notFoundIds.join(', ')} not found`);
      }

      const newTurn = queryRunner.manager.create(Turn, {
        date: createTurnDto.date,
        hour: createTurnDto.hour,
        observation: createTurnDto.observation,
        status: createTurnDto.status ?? TurnStatus.PENDING,
        patient,
        practitioners: specialists,
      });

      const savedTurn = await queryRunner.manager.save(newTurn);

      // After saving, populate the practitionerIds
      savedTurn.practitionerId = specialists.map(specialist => specialist.id);

      await queryRunner.commitTransaction();

      return savedTurn;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }

      throw ErrorManager.createSignatureError((error as Error).message);
    } finally {
      await queryRunner.release();
    }
  }

  async getOne(id: string): Promise<Turn> {
    try {
      const turn = await this.repository.findOne({
        where: { id, deletedAt: null },
        relations: ['patient', 'practitioners'],
      });

      if (!turn) {
        throw new NotFoundException(`Turn with ID ${id} not found`);
      }

      return turn;
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async getAll(page: number = 1, limit: number = 10): Promise<{ 
    turns: Turn[]; 
    total: number; 
    page: number; 
    limit: number;
    previousPage: number | null;
  }> {
    try {
      const [data, total] = await this.repository.findAndCount({
        where: { deletedAt: null },
        relations: ['patient', 'practitioners'],
        skip: (page - 1) * limit,
        take: limit,
      });
  
      return { 
        turns: data, 
        total, 
        page, 
        limit,
        previousPage: page > 1 ? page - 1 : null,
      };
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  // Turnos de un especialista por ID
  async getTurnsBySpecialist(specialistId: string, page: number = 1, limit: number = 10): Promise<{ 
    turns: Turn[]; 
    total: number; 
    page: number; 
    limit: number;
    previousPage: number | null;
  }> {
    try {
      const [data, total] = await this.repository.findAndCount({
        where: {
          practitioners: { id: specialistId },
          deletedAt: null,
        },
        relations: ['patient', 'practitioners'],
        skip: (page - 1) * limit,
        take: limit,
      });
  
      if (!data.length) {
        throw new NotFoundException(`No turns found for specialist with ID ${specialistId}`);
      }
  
      return { 
        turns: data, 
        total, 
        page, 
        limit,
        previousPage: page > 1 ? page - 1 : null,
      };
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  // Turnos de un paciente por ID
  async getTurnsByPatient(patientId: string, page: number = 1, limit: number = 10): Promise<{ 
    turns: Turn[]; 
    total: number; 
    page: number; 
    limit: number;
    previousPage: number | null;
  }> {
    try {
      const [data, total] = await this.repository.findAndCount({
        where: {
          patient: { id: patientId },
          deletedAt: null,
        },
        relations: ['patient', 'practitioners'],
        skip: (page - 1) * limit,
        take: limit,
      });
  
      if (!data.length) {
        throw new NotFoundException(`No turns found for patient with ID ${patientId}`);
      }
  
      return { 
        turns: data, 
        total, 
        page, 
        limit,
        previousPage: page > 1 ? page - 1 : null,
      };
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  //Obtener turnos completados por el ID del paciente (historial).
  async getCompletedTurnsByPatient(patientId: string, page: number = 1, limit: number = 10): Promise<{ 
    turns: Turn[]; 
    total: number; 
    page: number; 
    limit: number;
    previousPage: number | null;
  }> {
    try {
      const [data, total] = await this.repository.findAndCount({
        where: {
          patient: { id: patientId },
          status: TurnStatus.COMPLETED,
          deletedAt: null,
        },
        relations: ['patient', 'practitioners'],
        skip: (page - 1) * limit,
        take: limit,
      });
  
      if (!data.length) {
        throw new NotFoundException(`No completed turns found for patient ID ${patientId}`);
      }
  
      return { 
        total, 
        page, 
        limit,
        previousPage: page > 1 ? page - 1 : null,
        turns: data,
      };
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  //Soft delete para eliminar un turno.
  async removeTurn(id: string): Promise<{ message: string; deletedTurn: Turn }> {
    try {
      const turn = await this.repository.findOne({ where: { id, deletedAt: null } });

      if (!turn) {
        throw new NotFoundException(`Turn with ID ${id} not found`);
      }

      const deletedTurn = await this.repository.softRemove(turn);

      return {
        message: 'Turn deleted successfully',
        deletedTurn,
      };
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  //Recover para restaurar un turno eliminado.
  async recoverTurn(id: string): Promise<Turn> {
    try {
      const turn = await this.repository.findOne({ withDeleted: true, where: { id } });

      if (!turn) {
        throw new NotFoundException(`Turn with ID ${id} not found`);
      }

      await this.repository.recover(turn);
      return turn;
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  //Actualizar un turno.
  async updateTurn(id: string, updateTurnDto: UpdateTurnDto): Promise<Turn> {
    try {
      const turn = await this.repository.findOne({ where: { id, deletedAt: null } });

      if (!turn) {
        throw new NotFoundException(`Turn with ID ${id} not found`);
      }

      Object.assign(turn, updateTurnDto);
      return await this.repository.save(turn);
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

}
