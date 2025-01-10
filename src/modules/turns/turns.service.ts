import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../../common/bases/base.service';
import { ErrorManager } from '../../common/exceptions/error.manager';
import { CreateTurnDto, UpdateTurnDto } from '../../domain/dtos';
import { Patient, Specialist, Turn } from '../../domain/entities';
import { TurnStatus } from '../../domain/enums';
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

  // Método simplificado para crear turnos
  async createTurn(createTurnDto: CreateTurnDto): Promise<Turn> {
    const queryRunner = this.repository.manager.connection.createQueryRunner();
    
    console.log('Start creating turn...');
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      console.log('Validating patient existence...');
      // Validar existencia del paciente
      const patient = await queryRunner.manager.findOne(Patient, {
        where: { id: createTurnDto.patientId },
        relations: [] // Desactivar la carga de relaciones para evitar ciclos
      });
      if (!patient) {
        console.log(`Patient with ID ${createTurnDto.patientId} not found`);
        throw new NotFoundException(`Patient with ID ${createTurnDto.patientId} not found`);
      }
      console.log(`Found patient: ${patient.id}`);

      console.log('Validating specialists existence...');
      // Validar existencia de especialistas
      const specialistIds = createTurnDto.specialists.map((s) => s.id);
      const specialists = await queryRunner.manager.find(Specialist, {
        where: { id: In(specialistIds) },
        relations: [] // Desactivar la carga de relaciones para evitar ciclos
      });
      console.log('Specialists found:', specialists);
      if (specialists.length !== specialistIds.length) {
        console.log('One or more specialists not found');
        throw new NotFoundException('One or more specialists not found');
      }

      // Crear el turno
      console.log('Creating turn...');
      const newTurn = queryRunner.manager.create(Turn, {
        ...createTurnDto,
        patient, // Se asigna el paciente
        specialists, // Se asignan los especialistas
      });

      console.log('Saving new turn...');
      // Guardar el turno en la base de datos
      const savedTurn = await queryRunner.manager.save(newTurn);

      // Confirmar transacción
      console.log('Committing transaction...');
      await queryRunner.commitTransaction();

      // Retornar el turno creado con las relaciones cargadas
      console.log('Turn created successfully:', savedTurn);
      return savedTurn;
    } catch (error) {
      console.log('Error occurred:', error);
      await queryRunner.rollbackTransaction();
  
      if (error instanceof NotFoundException) {
        console.log('NotFoundException: ', error.message);
        throw error;
      }
      console.log('General error: ', error);
      throw ErrorManager.createSignatureError((error as Error).message);
    } finally {
      console.log('Releasing query runner...');
      await queryRunner.release();
    }
  }
  
  

  // Método que sube imágenes y se las asigna al nuevo turno
  async createWithDerivationImages(
    createTurnDto: CreateTurnDto,
    files?: Express.Multer.File[] | null
  ): Promise<Turn> {
    const queryRunner = this.repository.manager.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    let derivationImages = [];
    try {
      // Subida de imágenes si existen archivos
      if (files && files.length > 0) {
        derivationImages = await this.derivationImagesService.uploadFiles(files);
      }

      // Validar existencia del paciente
      const patient = await queryRunner.manager.findOne(Patient, {
        where: { id: createTurnDto.patientId },
      });
      if (!patient) {
        throw new Error(`Patient with ID ${createTurnDto.patientId} not found`);
      }

      // Validar existencia de especialistas
      const specialistIds = createTurnDto.specialists.map((s) => s.id);
      const specialists = await queryRunner.manager.find(Specialist, {
        where: { id: In(specialistIds) },
      });
      if (specialists.length !== specialistIds.length) {
        throw new Error('One or more specialists not found');
      }

      // Crear el turno
      const newTurn = queryRunner.manager.create(Turn, {
        ...createTurnDto,
        patient,
        specialists,
        derivationImages,
      });

      // Guardar el turno en la base de datos
      const savedTurn = await queryRunner.manager.save(newTurn);

      // Confirmar transacción
      await queryRunner.commitTransaction();

      // Retornar el turno creado con las relaciones cargadas
      return await this.findOne(savedTurn.id);
    } catch (error) {
      // Revertir transacción en caso de error
      await queryRunner.rollbackTransaction();

      // Eliminar imágenes subidas en caso de error
      if (derivationImages.length > 0) {
        await Promise.all(
          derivationImages.map((image) =>
            this.derivationImagesService.deleteImage(image.id)
          )
        );
      }

      // Lanzar error personalizado
      throw ErrorManager.createSignatureError((error as Error).message);
    } finally {
      await queryRunner.release();
    }
  }
  
  override async remove(id: string): Promise<string> {
    try {
      const turn = await this.findOne(id); // Verifica que la entidad existe
      const derivationImagesIds = turn.derivationImages
        ? turn.derivationImages.map((image) => image.id)
        : null; // Obtiene los ids de las imágenes

      // Inicia la transacción
      return await this.repository.manager.transaction(
        async (transactionalEntityManager) => {
          await transactionalEntityManager.remove(turn); // Elimina el turno

          // Elimina las imágenes pasandole los ids
          if (derivationImagesIds.length > 0) {
            derivationImagesIds.map((imageId) =>
              this.derivationImagesService.deleteImage(imageId)
            );
          }

          return `Entity with id ${id} deleted`;
        }
      );
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async removeWithManager(id: string, manager: EntityManager): Promise<string> {
    try {
      const turn = await manager.findOne(Turn, {
        where: { id }
      }); // Verifica que la entidad existes
      const derivationImagesIds = turn.derivationImages
        ? turn.derivationImages.map((image) => image.id)
        : null; // Obtiene los ids de las imágenes

      await manager.remove(turn); // Elimina el turno

      // Elimina las imágenes pasandole los ids
      if (derivationImagesIds.length > 0) {
        derivationImagesIds.map((imageId) =>
          this.derivationImagesService.deleteImage(imageId)
        );
      }

      return `Entity with id ${id} deleted`;
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async changeStatus(id: string, status: TurnStatus) {
    const turn = await this.findOne(id);

    // Verifica si el estado ya es el mismo, si es así, no se hacen cambios
    if (turn.status === status) {
      return turn;
    }

    // Asigna el nuevo status
    turn.status = status;

    return await this.repository.save(turn);
  }

  async removeByPatientWithManager(
    patientTurnId: string,
    manager: EntityManager
  ): Promise<string> {
    try {
      const turns: Turn[] = await manager
        .createQueryBuilder()
        .select(['turn.id'])
        .from(Turn, 'turn')
        .leftJoin(Patient, 'patient_user_connections')
        .where('patient_turn_id = :id', { id: patientTurnId })
        .execute();

      await Promise.all(
        turns.map(
          async (turn) => await this.removeWithManager(turn.id, manager)
        )
      );
      return `Turn of patient with id ${patientTurnId} deleted`;
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async getTurnsBySpecialist(specialistId: string): Promise<Turn[]> {
    try {
      const turns = await this.repository.find({
        where: { specialists: { id: specialistId } },
        relations: ['diagnostic', 'Patient', 'institution', 'attentionHourPatient'],
      });

      if (!turns.length) {
        throw ErrorManager.createSignatureError(`No turns found for specialist with id ${specialistId}`);
      }

      return turns;
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

}
