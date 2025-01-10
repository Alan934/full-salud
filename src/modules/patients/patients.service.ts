import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../../common/bases/base.service';
import {
  CreatePatientDto,
  UpdatePatientDto
} from '../../domain/dtos';
import { Patient } from '../../domain/entities';
import { ErrorManager } from '../../common/exceptions/error.manager';
import { EntityManager, Repository } from 'typeorm';
import { AuthService } from '../auth/auth.service';


@Injectable()
export class PatientService extends BaseService<
  Patient,
  CreatePatientDto,
  UpdatePatientDto
> {
  constructor(
    @InjectRepository(Patient) protected patientRepository: Repository<Patient>,
    @Inject(forwardRef(() => AuthService))
    protected authService: AuthService // Crear el metodo de crear usuario y paciente aca
  ) {
    super(patientRepository);
  }

  async create(createPatientDto: CreatePatientDto): Promise<Patient> {
    try {
      const newPatient = this.patientRepository.create(createPatientDto);
      return await this.patientRepository.save(newPatient);
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async getOne(id: string): Promise<Patient> {
    try {
      const patient = await this.patientRepository.findOne({
        where: { id },
        relations: ['user']
      });

      if (!patient) {
        throw ErrorManager.createSignatureError(`Patient with id ${id} not found`);
      }

      return patient;
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async getAll(): Promise<Patient[]> {
    try {
      return await this.patientRepository.find({ relations: ['user'] });
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async update(id: string, updatePatientDto: UpdatePatientDto): Promise<Patient> {
    try {
      const patient = await this.getOne(id);

      const updatedPatient = this.patientRepository.merge(patient, updatePatientDto);
      return await this.patientRepository.save(updatedPatient);
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async softDelete(id: string): Promise<string> {
    try {
      const patient = await this.getOne(id);

      await this.patientRepository.softRemove(patient);
      return `Patient with id ${id} has been soft deleted`;
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async restorePatient(id: string, manager: EntityManager): Promise<Patient> {
    try {
      const patient = await manager.findOne(Patient, {
        where: { id },
        withDeleted: true
      });

      if (!patient) {
        throw ErrorManager.createSignatureError(`Patient with id ${id} not found or not deleted`);
      }

      return await manager.recover(Patient, patient);
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async getByDni(dni: string): Promise<Patient> {
    try {
      const patient = await this.patientRepository.findOne({
        where: { dni },
        relations: ['user']
      });

      return patient;
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async removeWithManager(id: string, manager: EntityManager) {
    try {
      const entity = await manager.findOne(Patient, {
        where: { id }
      });
      await manager.remove(Patient, entity);
      await this.authService.removeWithManager(entity.user.id, manager);
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async softRemoveWithManager(id: string, manager: EntityManager) {
    try {
      const entity = await manager.findOne(Patient, {
        where: { id }
      });
      await this.authService.softRemoveWithManager(entity.user.id, manager);
      await manager.softRemove(Patient, entity);
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async restoreWithManager(
    id: string,
    manager: EntityManager
  ): Promise<Patient> {
    try {
      const entity = await manager.findOne(Patient, {
        where: { id },
        withDeleted: true
      });
      await this.authService.restoreWithManager(entity.user.id, manager);
      return await manager.recover(Patient, entity);
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }
}

